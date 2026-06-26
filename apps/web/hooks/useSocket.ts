import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyZDg5NzNlLTIxMzctNDEyZS05NzI2LTI4MzU3NmRlYjlmMyIsImVtYWlsIjoibWFuaUBnbWFpbC5jb20iLCJuYW1lIjoic3V1ZCIsImlhdCI6MTc4MjA1NjY4MH0.Z9Z1ne9p-ybhKoGKpjbEqa3KoA8FQrr51dumXaO0hQU`);
    
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    loading,
    socket
  };
}
