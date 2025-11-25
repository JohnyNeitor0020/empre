import { ClientData } from "@/types/loan";
import { CurpInput } from "../CurpInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, User, Phone, Cake, Share2, CreditCard } from "lucide-react";

interface ClientStepProps {
  data: ClientData;
  onChange: (data: Partial<ClientData>) => void;
  errors?: Record<string, string>;
}

export const ClientStep = ({ data, onChange, errors }: ClientStepProps) => {

  
  return (
    <div className="space-y-6">

      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Información del Cliente</h2>
      </div>

      <CurpInput
        value={data.curp}
        onChange={(curp, score) => onChange({ curp, score })}
        error={errors?.curp}
      />

      <div className="space-y-2">
        <Label htmlFor="nombre_completo">
          Nombre Completo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nombre_completo"
          value={data.nombre_completo}
          onChange={(e) => onChange({ nombre_completo: e.target.value })}
          placeholder="Juan Pérez García"
        />
        {errors?.nombre_completo && (
          <p className="text-xs text-destructive">{errors.nombre_completo}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="prioritario"
          checked={data.prioritario}
          onCheckedChange={(checked) => onChange({ prioritario: checked as boolean })}
        />
        <Label htmlFor="prioritario" className="text-sm font-normal cursor-pointer">
          Cliente prioritario (con alguna discapacidad)
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          WhatsApp <span className="text-destructive">*</span>
        </Label>
        <Input
          id="whatsapp"
          type="tel"
          value={data.whatsapp}
          onChange={(e) => onChange({ whatsapp: e.target.value.replace(/\D/g, '') })}
          placeholder="5512345678"
          maxLength={10}
        />
        {errors?.whatsapp && (
          <p className="text-xs text-destructive">{errors.whatsapp}</p>
        )}
      </div>

      {/* Reemplazar calendario a uno easy */}
      <div className="space-y-2">
        <Label htmlFor="cumpleanos" className="flex items-center gap-2">
          <Cake className="h-4 w-4" />
          Fecha de Cumpleaños <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cumpleanos"
          type="date"
          value={data.cumpleanos ? new Date(data.cumpleanos).toISOString().split("T")[0] : ""}
          onChange={(e) => onChange({ cumpleanos: e.target.value ? new Date(e.target.value) : null })}
          max={new Date().toISOString().split("T")[0]}
          min="1900-01-01"
        />
        {errors?.cumpleanos && (
          <p className="text-xs text-destructive">{errors.cumpleanos}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ine">
          Identificación (INE) <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="ine"
            type="file"
            accept="image/*"
            onChange={(e) => onChange({ ine: e.target.files?.[0] || null })}
            className="cursor-pointer"
          />
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        {data.ine && (
          <p className="text-xs text-success">✓ Archivo cargado: {data.ine.name}</p>
        )}
        {errors?.ine && (
          <p className="text-xs text-destructive">{errors.ine}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="redes_sociales" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Red Social <span className="text-muted-foreground text-xs">(Opcional)</span>
        </Label>
        <Input
          id="redes_sociales"
          value={data.redes_sociales || ''}
          onChange={(e) => onChange({ redes_sociales: e.target.value })}
          placeholder="@usuario"
        />
      </div>

      {data.redes_sociales && (
        <div className="space-y-2">
          <Label htmlFor="red_social">Tipo de Red Social</Label>
          <Select
            value={data.red_social || ''}
            onValueChange={(value: 'facebook' | 'instagram' | 'otro') => onChange({ red_social: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una red social" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2 pb-2 border-b border-border mt-6">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Información Financiera</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sueldo">
            Sueldo Mensual <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sueldo"
            type="number"
            value={data.sueldo || ''}
            onChange={(e) => onChange({ sueldo: parseFloat(e.target.value) || 0 })}
            placeholder="00.00"
            min="1000"
            step="1000"
          />
          {errors?.sueldo && (
            <p className="text-xs text-destructive">{errors.sueldo}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="banco">
            Banco <span className="text-destructive">*</span>
          </Label>
          <Input
            id="banco"
            value={data.banco || ''}
            onChange={(e) => onChange({ banco: e.target.value })}
            placeholder="Nombre del banco"
          />
          {errors?.banco && (
            <p className="text-xs text-destructive">{errors.banco}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clabe">
            CLABE <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clabe"
            value={data.clabe || ''}
            onChange={(e) => onChange({ clabe: e.target.value.replace(/\D/g, '') })}
            placeholder="18 dígitos"
            maxLength={18}
          />
          {errors?.clabe && (
            <p className="text-xs text-destructive">{errors.clabe}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuenta">
            Número de Cuenta <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cuenta"
            value={data.cuenta || ''}
            onChange={(e) => onChange({ cuenta: e.target.value.replace(/\D/g, '') })}
            placeholder="Número de cuenta"
          />
          {errors?.cuenta && (
            <p className="text-xs text-destructive">{errors.cuenta}</p>
          )}
        </div>
      </div>
      
    </div>
  );
};
