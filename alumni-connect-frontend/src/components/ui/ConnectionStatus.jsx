import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [services, setServices] = useState({});

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
      const healthUrl = apiUrl.replace('/graphql', '/health');
      const response = await fetch(healthUrl);
      const data = await response.json();

      setStatus('connected');
      setServices(data.subgraphs || {});
    } catch (error) {
      setStatus('disconnected');
      setServices({});
    }
  };

  if (status === 'checking') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === 'connected' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-2 py-1.5 shadow-md flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-green-600" />
          <div className="flex items-center gap-1.5 text-[10px] text-green-700">
            <span>ID:{services['identity-service'] === 'healthy' ? '✓' : '✗'}</span>
            <span>EV:{services['event-service'] === 'healthy' ? '✓' : '✗'}</span>
            <span>FD:{services['funding-service'] === 'healthy' ? '✓' : '✗'}</span>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 shadow-lg flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-900">Gateway Disconnected</p>
            <p className="text-xs text-red-700">Check if services are running</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;