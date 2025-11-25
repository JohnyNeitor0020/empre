import { STEPS } from "@/types/loan";

interface ProgressBarProps {
  currentStep: number;
  steps?: readonly string[];
}

export const ProgressBar = ({ currentStep, steps = STEPS }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium">
          Paso {currentStep + 1} de {steps.length}
        </span>
        <span className="text-primary font-semibold">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="relative w-full h-3 bg-green-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-green-700 transition-all duration-500 ease-out rounded-full shadow-md"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      <p className="text-sm text-center font-medium text-foreground pt-1">
        {steps[currentStep]}
      </p>
    </div>
  );
};
