import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
  : 'http://localhost:3000';

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });
    }

    return () => {
      // Don't disconnect immediately on unmount in case it's used across navigation
      // Only disconnect on logout (handled above)
    };
  }, [isAuthenticated, token]);

  const joinOrderRoom = (orderId: string | number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('order:join', { orderId });
    }
  };

  const leaveOrderRoom = (orderId: string | number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('order:leave', { orderId });
    }
  };

  const joinDriverRoom = (driverId: string | number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('driver:join', { driverId });
    }
  };

  const onNewOrder = (callback: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on('new_order', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_order', callback);
      }
    };
  };

  const onOrderStatusUpdated = (callback: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on('order:updated', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('order:updated', callback);
      }
    };
  };

  const onDriverLocationUpdated = (callback: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on('driver:location', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('driver:location', callback);
      }
    };
  };

  const onDriverOrderOffered = (callback: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on('driver:order-offered', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('driver:order-offered', callback);
      }
    };
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinOrderRoom,
    leaveOrderRoom,
    joinDriverRoom,
    onNewOrder,
    onOrderStatusUpdated,
    onDriverLocationUpdated,
    onDriverOrderOffered,
  };
};
