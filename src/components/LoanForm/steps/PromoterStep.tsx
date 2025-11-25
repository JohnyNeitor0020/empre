import { PromoterData } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Route } from "lucide-react";

interface PromoterStepProps {
  promoterData: PromoterData;
  onPromoterChange: (data: Partial<PromoterData>) => void;
  errors?: Record<string, string>;
}

export const PromoterStep = ({
  promoterData,

  onPromoterChange,

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
            value={promoterData.nombre}
            onChange={(e) => onPromoterChange({ nombre: e.target.value })}
            placeholder="Ana García"
          />
          {errors?.promoternombre_completo && (
            <p className="text-xs text-destructive">{errors.promoternombre_completo}</p>
          )}
        </div>


        <div className="space-y-2">
          <Label htmlFor="route" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Nombre de Ruta <span className="text-destructive">*</span>
          </Label>
          <Input
            id="route"
            value={promoterData.ruta}
            onChange={(e) => onPromoterChange({ ruta: e.target.value })}
            placeholder="Ruta Centro"
          />
          {errors?.route && (
            <p className="text-xs text-destructive">{errors.route}</p>
          )}
        </div>
      </div>

    </div>
  );
};
