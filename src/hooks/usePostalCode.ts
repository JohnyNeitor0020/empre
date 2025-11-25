// hooks/usePostalCode.ts
import { useState, useEffect } from 'react';

interface PostalCodeData {
  cp: string;
  colonias: string[];
  municipio: string;
  estado: string;
  ciudad: string;
}

export const usePostalCode = (cp: string) => {
  const [data, setData] = useState<PostalCodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cp || cp.length !== 5) {
      setData(null);
      setError(null);
      return;
    }

    const fetchPostalCodeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_URL}/direccion/cp/${cp}`);
        
        if (!response.ok) {
          throw new Error('Código postal no encontrado');
        }
        
        const result: PostalCodeData = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar código postal');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar muchas peticiones
    const timeoutId = setTimeout(fetchPostalCodeData, 500);
    return () => clearTimeout(timeoutId);
  }, [cp]);

  return { data, loading, error };
};