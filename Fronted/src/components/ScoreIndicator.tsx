import { ScoreType } from "@/types/loan";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  score: ScoreType;
  className?: string;
}

export const ScoreIndicator = ({ score, className }: ScoreIndicatorProps) => {
  if (!score) return null;
  
  const config = {
    good: {
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
      label: "Buen Cliente"
    },
    warning: {
      icon: AlertCircle,
      color: "text-warning",
      bg: "bg-warning/10",
      label: "Cliente Regular"
    },
    bad: {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "Cliente de Riesgo"
    }
  };
  
  const { icon: Icon, color, bg, label } = config[score];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("p-2 rounded-full", bg)}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <span className={cn("text-sm font-medium", color)}>
        {label}
      </span>
    </div>
  );
};
