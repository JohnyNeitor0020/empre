import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GeolocationButtonProps {
  onLocationCapture: (lat: number, lng: number) => void;
  disabled?: boolean;
}

export const GeolocationButton = ({ onLocationCapture, disabled }: GeolocationButtonProps) => {
  const [loading, setLoading] = useState(false);
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no disponible en este navegador");
      return;
    }
    
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationCapture(latitude, longitude);
        toast.success("Ubicación capturada correctamente");
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("No se pudo obtener la ubicación. Verifica los permisos.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGetLocation}
      disabled={loading || disabled}
      className="w-full sm:w-auto"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Obteniendo ubicación...
        </>
      ) : (
        <>
          <MapPin className="mr-2 h-4 w-4" />
          Capturar Ubicación
        </>
      )}
    </Button>
  );
};
