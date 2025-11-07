import { GuarantorData } from "@/types/loan";
import { CurpInput } from "../CurpInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Phone, Users } from "lucide-react";

interface GuarantorStepProps {
  data: GuarantorData;
  onChange: (data: Partial<GuarantorData>) => void;
  errors?: Record<string, string>;
  existingCurps: string[];
  title?: string;
  isReference?: boolean;
}

export const GuarantorStep = ({ 
  data, 
  onChange, 
  errors, 
  existingCurps,
  title = "Información del Aval",
  isReference = false
}: GuarantorStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        {isReference ? <Users className="h-5 w-5 text-primary" /> : <Shield className="h-5 w-5 text-primary" />}
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      
      <CurpInput
        value={data.curp}
        onChange={(curp, score) => onChange({ curp, score })}
        error={errors?.curp}
        existingCurps={existingCurps}
      />
      
      <div className="space-y-2">
        <Label htmlFor="fullName" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Nombre Completo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="María García López"
        />
        {errors?.fullName && (
          <p className="text-xs text-destructive">{errors.fullName}</p>
        )}
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
        <Label htmlFor="relationship">
          Parentesco <span className="text-destructive">*</span>
        </Label>
        <Input
          id="relationship"
          value={data.relationship}
          onChange={(e) => onChange({ relationship: e.target.value })}
          placeholder="Hermano/a, Primo/a, Amigo/a"
        />
        {errors?.relationship && (
          <p className="text-xs text-destructive">{errors.relationship}</p>
        )}
      </div>
    </div>
  );
};
