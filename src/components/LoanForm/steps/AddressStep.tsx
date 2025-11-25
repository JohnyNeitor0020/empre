import { useState, useEffect } from "react";
import { AddressData } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeolocationButton } from "../GeolocationButton";
import { MapPin, Home, Loader2 } from "lucide-react";
import { usePostalCode } from "@/hooks/usePostalCode";

interface AddressStepProps {
  data: AddressData;
  onChange: (data: Partial<AddressData>) => void;
  errors?: Record<string, string>;
  title?: string;
}

export const AddressStep = ({ data, onChange, title = "Domicilio" }: AddressStepProps) => {
  const [localPostalCode, setLocalPostalCode] = useState(data.cp);
  const { data: postalCodeData, loading, error } = usePostalCode(localPostalCode);

  useEffect(() => {
    setLocalPostalCode(data.cp);
  }, [data.cp]);

  useEffect(() => {
    if (postalCodeData) {
      onChange({
        ciudad: postalCodeData.ciudad,
        colonia: postalCodeData.colonias.length === 1 ? postalCodeData.colonias[0] : data.colonia
      });
    }
  }, [postalCodeData]);

  const handlePostalCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 5);
    setLocalPostalCode(numericValue);

    onChange({
      cp: numericValue,
      colonia: "",
      ciudad: ""
    });
  };

  const handleFieldChange = (field: keyof AddressData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Home className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>

      {/* CP Y COLONIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Código Postal */}
        <div className="space-y-2">
          <Label>Código Postal *</Label>
          <div className="relative">
            <Input
              value={localPostalCode}
              onChange={(e) => handlePostalCodeChange(e.target.value)}
              placeholder="12345"
              maxLength={5}
              className={error ? "border-destructive" : ""}
            />
            {loading && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin" />}
          </div>

          {loading && <p className="text-xs text-blue-600">Buscando...</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}

          {postalCodeData && (
            <p className="text-xs text-green-600">
              ✓ {postalCodeData.municipio}, {postalCodeData.estado}
            </p>
          )}
        </div>

        {/* Colonia */}
        <div className="space-y-2">
          <Label>Colonia *</Label>

          {postalCodeData?.colonias ? (
            <Select
              value={data.colonia}
              onValueChange={(value) => handleFieldChange("colonia", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {postalCodeData.colonias.map((col) => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={data.colonia}
              onChange={(e) => handleFieldChange("colonia", e.target.value)}
              placeholder="Centro"
            />
          )}
        </div>

      </div>

      {/* CALLE */}
      <div className="space-y-2">
        <Label>Calle *</Label>
        <Input
          value={data.calle}
          onChange={(e) => handleFieldChange("calle", e.target.value)}
          placeholder="Av. Juárez"
        />
      </div>

      {/* NUMEROS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label>Número Exterior *</Label>
          <Input
            value={data.numero_ext}
            onChange={(e) => handleFieldChange("numero_ext", e.target.value)}
            placeholder="123"
          />
        </div>

        <div className="space-y-2">
          <Label>Número Interior</Label>
          <Input
            value={data.numero_int || ""}
            onChange={(e) => handleFieldChange("numero_int", e.target.value)}
            placeholder="B2"
          />
        </div>

      </div>

      {/* ENTRE CALLES */}
      <div className="space-y-2">
        <Label>Entre calles *</Label>
        <Input
          value={data.cruces}
          onChange={(e) => handleFieldChange("cruces", e.target.value)}
          placeholder="Hidalgo y Morelos"
        />
      </div>

      {/* CIUDAD */}
      <div className="space-y-2">
        <Label>Ciudad *</Label>
        <Input
          value={data.ciudad}
          onChange={(e) => handleFieldChange("ciudad", e.target.value)}
          disabled={!!postalCodeData}
        />
      </div>

      {/* MAPS */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Ubicación GPS
        </Label>

        <GeolocationButton
          onLocationCapture={(lat, lng) => onChange({ maps: `${lat}, ${lng}` })}
        />

        {data.maps && (
          <p className="text-xs text-green-600">
            ✓ Ubicación capturada: {data.maps}
          </p>
        )}
      </div>

      {/* SOLO PARA DOMICILIO PRINCIPAL */}
      {title === "Domicilio" && (
        <>
          {/* Vivienda */}
          <div className="space-y-2">
            <Label>Tipo de Vivienda *</Label>
            <Select
              value={data.vivienda}
              onValueChange={(value) => onChange({ vivienda: value as AddressData["vivienda"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="propia">Propia</SelectItem>
                <SelectItem value="rentada">Rentada</SelectItem>
                <SelectItem value="familiar">Familiar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tiempo */}
          <div className="space-y-2">
            <Label>Tiempo viviendo (meses) *</Label>
            <Input
              value={data.tiempo}
              onChange={(e) => handleFieldChange("tiempo", e.target.value)}
              placeholder="12"
            />
          </div>
        </>
      )}
    </div>
  );
};
