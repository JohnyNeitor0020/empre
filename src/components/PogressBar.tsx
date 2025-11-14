import { STEPS } from "@/types/loan";
import { CheckCircle2, Circle } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  return (
    <div className="w-full space-y-4">
      {/* Progress Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">
              Paso {currentStep + 1} de {STEPS.length}
            </span>
          </div>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-success/10 rounded-full border border-primary/20">
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}% Completado
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-secondary/50 rounded-full overflow-hidden shadow-inner border border-border/50">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary-light to-success transition-all duration-700 ease-out rounded-full shadow-lg"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md animate-pulse"></div>
        </div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex items-center justify-between px-1">
        {STEPS.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-1 flex-1">
            {index <= currentStep ? (
              <CheckCircle2 className="h-5 w-5 text-success animate-in zoom-in duration-300" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>
      
      {/* Current Step Name */}
      <div className="text-center">
        <p className="text-base font-semibold text-foreground bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-3 px-6 rounded-lg border border-primary/10">
          {STEPS[currentStep]}
        </p>
      </div>
    </div>
  );
};
