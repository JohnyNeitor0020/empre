import { ScoreType } from "@/types/loan";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  score: ScoreType;
  className?: string;
}

export const ScoreIndicator = ({ score, className }: ScoreIndicatorProps) => {
  if (!score) return null;
  //Aignacion de color
  const config = {
    good: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
      label: "",
      emoji: "",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      label: "",
      emoji: "",
    },
    bad: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
      label: "",
      emoji: "",
    },
  } as const;

  // Soporte para valores en español o inglés
  const scoreMap: Record<NonNullable<ScoreType>, keyof typeof config> = {
    bueno: "good",
    regular: "warning",
    malo: "bad",
    good: "good",
    warning: "warning",
    bad: "bad",
  } as any;

  const key = scoreMap[score as NonNullable<ScoreType>] ?? "good";
  const { icon: Icon, color, bg, label, emoji } = config[key];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("p-2 rounded-full", bg)}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <span className={cn("text-sm font-medium", color)}>
        {label} <span aria-hidden="true">{emoji}</span>
      </span>
    </div>
  );
};
