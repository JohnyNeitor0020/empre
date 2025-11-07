import { ClientData } from "@/types/loan";
import { CurpInput } from "../CurpInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Upload, User, Phone, Cake, Share2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

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
        <Label htmlFor="fullName">
          Nombre Completo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Juan Pérez García"
        />
        {errors?.fullName && (
          <p className="text-xs text-destructive">{errors.fullName}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDisabled"
          checked={data.isDisabled}
          onCheckedChange={(checked) => onChange({ isDisabled: checked as boolean })}
        />
        <Label htmlFor="isDisabled" className="text-sm font-normal cursor-pointer">
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
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Cake className="h-4 w-4" />
          Fecha de Cumpleaños <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !data.birthday && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.birthday ? format(data.birthday, "PPP", { locale: es }) : "Selecciona una fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.birthday || undefined}
              onSelect={(date) => onChange({ birthday: date || null })}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors?.birthday && (
          <p className="text-xs text-destructive">{errors.birthday}</p>
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
        <Label htmlFor="socialMedia" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Red Social <span className="text-muted-foreground text-xs">(Opcional)</span>
        </Label>
        <Input
          id="socialMedia"
          value={data.socialMedia || ''}
          onChange={(e) => onChange({ socialMedia: e.target.value })}
          placeholder="@usuario"
        />
      </div>
      
      {data.socialMedia && (
        <div className="space-y-2">
          <Label htmlFor="socialMediaType">Tipo de Red Social</Label>
          <Select
            value={data.socialMediaType || ''}
            onValueChange={(value: 'facebook' | 'instagram') => onChange({ socialMediaType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una red social" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
