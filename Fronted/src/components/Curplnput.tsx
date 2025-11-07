import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScoreIndicator } from "./ScoreIndicator";
import { isValidCurp, generateRandomScore } from "@/lib/curpValidator";
import { ScoreType } from "@/types/loan";
import { AlertCircle } from "lucide-react";

interface CurpInputProps {
  value: string;
  onChange: (value: string, score: ScoreType) => void;
  label?: string;
  existingCurps?: string[];
  error?: string;
  required?: boolean;
}

export const CurpInput = ({ 
  value, 
  onChange, 
  label = "CURP", 
  existingCurps = [],
  error,
  required = true
}: CurpInputProps) => {
  const [score, setScore] = useState<ScoreType>(null);
  const [validationError, setValidationError] = useState<string>("");
  
  useEffect(() => {
    if (value.length === 18) {
      // Validar formato
      if (!isValidCurp(value)) {
        setValidationError("CURP inválido");
        setScore(null);
        return;
      }
      
      // Validar que no esté duplicado
      if (existingCurps.includes(value.toUpperCase())) {
        setValidationError("Este CURP ya fue registrado");
        setScore(null);
        return;
      }
      
      // Generar score aleatorio
      const newScore = generateRandomScore();
      setScore(newScore);
      setValidationError("");
      onChange(value.toUpperCase(), newScore);
    } else {
      setScore(null);
      setValidationError("");
    }
  }, [value, existingCurps]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue, null);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="curp" className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <Input
            id="curp"
            value={value}
            onChange={handleChange}
            placeholder="AAAA000000HAAAXXX00"
            maxLength={18}
            className={validationError || error ? "border-destructive" : ""}
          />
          {(validationError || error) && (
            <div className="flex items-center gap-1 mt-1 text-destructive text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>{validationError || error}</span>
            </div>
          )}
        </div>
        
        {score && <ScoreIndicator score={score} />}
      </div>
    </div>
  );
};
