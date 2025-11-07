import { PromoterData, SupervisorData } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Phone, Mail, Route } from "lucide-react";

interface PromoterStepProps {
  promoterData: PromoterData;
  supervisorData: SupervisorData;
  onPromoterChange: (data: Partial<PromoterData>) => void;
  onSupervisorChange: (data: Partial<SupervisorData>) => void;
  errors?: Record<string, string>;
}

export const PromoterStep = ({ 
  promoterData, 
  supervisorData,
  onPromoterChange, 
  onSupervisorChange,
  errors 
}: PromoterStepProps) => {
  return (
    <div className="space-y-8">
      {/* Promotora Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <UserCheck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Promotora</h2>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="promoterName">
            Nombre Completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="promoterName"
            value={promoterData.fullName}
            onChange={(e) => onPromoterChange({ fullName: e.target.value })}
            placeholder="Ana García"
          />
          {errors?.promoterFullName && (
            <p className="text-xs text-destructive">{errors.promoterFullName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="promoterPhone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Teléfono <span className="text-destructive">*</span>
          </Label>
          <Input
            id="promoterPhone"
            type="tel"
            value={promoterData.phone}
            onChange={(e) => onPromoterChange({ phone: e.target.value.replace(/\D/g, '') })}
            placeholder="5512345678"
            maxLength={10}
          />
          {errors?.promoterPhone && (
            <p className="text-xs text-destructive">{errors.promoterPhone}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="promoterEmail" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo Electrónico <span className="text-destructive">*</span>
          </Label>
          <Input
            id="promoterEmail"
            type="email"
            value={promoterData.email}
            onChange={(e) => onPromoterChange({ email: e.target.value })}
            placeholder="ana.garcia@ejemplo.com"
          />
          {errors?.promoterEmail && (
            <p className="text-xs text-destructive">{errors.promoterEmail}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="route" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Nombre de Ruta <span className="text-destructive">*</span>
          </Label>
          <Input
            id="route"
            value={promoterData.route}
            onChange={(e) => onPromoterChange({ route: e.target.value })}
            placeholder="Ruta Centro"
          />
          {errors?.route && (
            <p className="text-xs text-destructive">{errors.route}</p>
          )}
        </div>
      </div>
      
      {/* Supervisora Section */}
      <div className="space-y-6 pt-6 border-t-2 border-border">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <UserCheck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Supervisora</h2>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supervisorName">
            Nombre Completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="supervisorName"
            value={supervisorData.fullName}
            onChange={(e) => onSupervisorChange({ fullName: e.target.value })}
            placeholder="Laura Martínez"
          />
          {errors?.supervisorFullName && (
            <p className="text-xs text-destructive">{errors.supervisorFullName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supervisorPhone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Teléfono <span className="text-destructive">*</span>
          </Label>
          <Input
            id="supervisorPhone"
            type="tel"
            value={supervisorData.phone}
            onChange={(e) => onSupervisorChange({ phone: e.target.value.replace(/\D/g, '') })}
            placeholder="5512345678"
            maxLength={10}
          />
          {errors?.supervisorPhone && (
            <p className="text-xs text-destructive">{errors.supervisorPhone}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supervisorEmail" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo Electrónico <span className="text-destructive">*</span>
          </Label>
          <Input
            id="supervisorEmail"
            type="email"
            value={supervisorData.email}
            onChange={(e) => onSupervisorChange({ email: e.target.value })}
            placeholder="laura.martinez@ejemplo.com"
          />
          {errors?.supervisorEmail && (
            <p className="text-xs text-destructive">{errors.supervisorEmail}</p>
          )}
        </div>
      </div>
    </div>
  );
};
