import { useState, useEffect } from 'react';
import { checkOllamaHealth } from '../services/ollama';

export function useOllamaStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      setChecking(true);
      const ok = await checkOllamaHealth();
      if (mounted) {
        setIsConnected(ok);
        setChecking(false);
      }
    }

    check();
    const interval = setInterval(check, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isConnected, checking };
}
