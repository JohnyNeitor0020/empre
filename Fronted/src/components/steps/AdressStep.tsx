import { AddressData } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeolocationButton } from "../GeolocationButton";
import { MapPin, Home } from "lucide-react";

interface AddressStepProps {
  data: AddressData;
  onChange: (data: Partial<AddressData>) => void;
  errors?: Record<string, string>;
  title?: string;
}

export const AddressStep = ({ data, onChange, errors, title = "Domicilio" }: AddressStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Home className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            Código Postal <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postalCode"
            value={data.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value.replace(/\D/g, '') })}
            placeholder="12345"
            maxLength={5}
          />
          {errors?.postalCode && (
            <p className="text-xs text-destructive">{errors.postalCode}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="neighborhood">
            Colonia <span className="text-destructive">*</span>
          </Label>
          <Input
            id="neighborhood"
            value={data.neighborhood}
            onChange={(e) => onChange({ neighborhood: e.target.value })}
            placeholder="Centro"
          />
          {errors?.neighborhood && (
            <p className="text-xs text-destructive">{errors.neighborhood}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street">
          Calle <span className="text-destructive">*</span>
        </Label>
        <Input
          id="street"
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
          placeholder="Av. Juárez"
        />
        {errors?.street && (
          <p className="text-xs text-destructive">{errors.street}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exteriorNumber">
            Número Exterior <span className="text-destructive">*</span>
          </Label>
          <Input
            id="exteriorNumber"
            value={data.exteriorNumber}
            onChange={(e) => onChange({ exteriorNumber: e.target.value })}
            placeholder="123"
          />
          {errors?.exteriorNumber && (
            <p className="text-xs text-destructive">{errors.exteriorNumber}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interiorNumber">
            Número Interior <span className="text-muted-foreground text-xs">(Opcional)</span>
          </Label>
          <Input
            id="interiorNumber"
            value={data.interiorNumber || ''}
            onChange={(e) => onChange({ interiorNumber: e.target.value })}
            placeholder="4B"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="crossStreets">
          Entre Calles <span className="text-destructive">*</span>
        </Label>
        <Input
          id="crossStreets"
          value={data.crossStreets}
          onChange={(e) => onChange({ crossStreets: e.target.value })}
          placeholder="Hidalgo y Morelos"
        />
        {errors?.crossStreets && (
          <p className="text-xs text-destructive">{errors.crossStreets}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">
          Ciudad <span className="text-destructive">*</span>
        </Label>
        <Input
          id="city"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="Ciudad de México"
        />
        {errors?.city && (
          <p className="text-xs text-destructive">{errors.city}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Ubicación GPS
        </Label>
        <GeolocationButton
          onLocationCapture={(lat, lng) => onChange({ latitude: lat, longitude: lng })}
        />
        {data.latitude && data.longitude && (
          <p className="text-xs text-success">
            ✓ Ubicación capturada: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
          </p>
        )}
      </div>
      
      {title === "Domicilio" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="housingType">
              Tipo de Vivienda <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.housingType}
              onValueChange={(value: AddressData['housingType']) => onChange({ housingType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de vivienda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Propia</SelectItem>
                <SelectItem value="paying">Propia (pagándose)</SelectItem>
                <SelectItem value="rented">Rentada</SelectItem>
                <SelectItem value="family">Familiar</SelectItem>
              </SelectContent>
            </Select>
            {errors?.housingType && (
              <p className="text-xs text-destructive">{errors.housingType}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeAtAddress">
              Tiempo Viviendo en el Domicilio <span className="text-destructive">*</span>
            </Label>
            <Input
              id="timeAtAddress"
              value={data.timeAtAddress}
              onChange={(e) => onChange({ timeAtAddress: e.target.value })}
              placeholder="5 años"
            />
            {errors?.timeAtAddress && (
              <p className="text-xs text-destructive">{errors.timeAtAddress}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
