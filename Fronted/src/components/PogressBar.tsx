import { STEPS } from "@/types/loan";

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium">
          Paso {currentStep + 1} de {STEPS.length}
        </span>
        <span className="text-primary font-semibold">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-primary transition-all duration-500 ease-out rounded-full shadow-md"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
      
      <p className="text-sm text-center font-medium text-foreground pt-1">
        {STEPS[currentStep]}
      </p>
    </div>
  );
};
