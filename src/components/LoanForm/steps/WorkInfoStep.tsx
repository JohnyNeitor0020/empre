import { WorkData } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Building2, Phone } from "lucide-react";

interface WorkInfoStepProps {
  data: WorkData;
  onChange: (data: Partial<WorkData>) => void;
  errors?: Record<string, string>;
  title?: string;
}

export const WorkInfoStep = ({ data, onChange, errors, title = "Información Laboral" }: WorkInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Briefcase className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Nombre de la Empresa <span className="text-destructive">*</span>
        </Label>
        <Input
          id="companyName"
          value={data.empresa}
          onChange={(e) => onChange({ empresa: e.target.value })}
          placeholder="Empresa S.A. de C.V."
        />
        {errors?.empresa && (
          <p className="text-xs text-destructive">{errors.empresa}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">
          Puesto de Trabajo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="position"
          value={data.puesto}
          onChange={(e) => onChange({ puesto: e.target.value })}
          placeholder="Gerente de Ventas"
        />
        {errors?.puesto && (
          <p className="text-xs text-destructive">{errors.puesto}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyPhone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Teléfono de la Empresa <span className="text-destructive">*</span>
        </Label>
        <Input
          id="companyPhone"
          type="tel"
          value={data.telefono}
          onChange={(e) => onChange({ telefono: e.target.value.replace(/\D/g, '') })}
          placeholder="5512345678"
          maxLength={10}
        />
        {errors?.companyPhone && (
          <p className="text-xs text-destructive">{errors.companyPhone}</p>
        )}
      </div>
      {/* Salario agregado al principio
      <div className="space-y-2">
        <Label htmlFor="salary" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Sueldo Mensual <span className="text-destructive">*</span>
        </Label>
        <Input
          id="salary"
          type="text"
          value={data.salary}
          onChange={(e) => onChange({ salary: e.target.value })}
          placeholder="$15,000"
        />
        {errors?.salary && (
          <p className="text-xs text-destructive">{errors.salary}</p>
        )}
      </div>
      */}
    </div>
  );
};
