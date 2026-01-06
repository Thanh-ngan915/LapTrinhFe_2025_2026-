import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import websocketService from '../services/websocketService';
import { setMessages, addMessage } from '../redux/slices/chatSlice';

const useMessages = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessages = (data) => {
      if (data.data && Array.isArray(data.data)) {
        dispatch(setMessages(data.data));
      }
    };

    websocketService.on('GET_ROOM_CHAT_MES', handleMessages);

    websocketService.on('SEND_CHAT', (data) => {
      const raw = data.data || data;

      const msg = (typeof raw === 'string') ? { mes: raw, time: new Date().toLocaleTimeString() } : {
        from: raw.from || raw.user || raw.sender || raw.name || 'Unknown',
        mes: raw.mes || raw.message || raw.msg || raw.text || (typeof raw === 'string' ? raw : ''),
        time: raw.createAt || raw.create_at || raw.time || raw.t || raw.timestamp || new Date().toLocaleTimeString(),
        to: raw.to,
        type: raw.type || (raw.room ? 'room' : (raw.to ? 'people' : undefined)),
      };

      dispatch(addMessage(msg));
    });

    return () => {
      websocketService.off('GET_ROOM_CHAT_MES', handleMessages);
    };
  }, [dispatch]);
};

export default useMessages;