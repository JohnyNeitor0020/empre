import { LoanDetailsData } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, Calculator } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { calculateLoan, formatCurrency, isSaturday } from "@/lib/loanCalculator";
import { useEffect } from "react";

interface LoanDetailsStepProps {
  data: LoanDetailsData;
  onChange: (data: Partial<LoanDetailsData>) => void;
  errors?: Record<string, string>;
}

export const LoanDetailsStep = ({ data, onChange, errors }: LoanDetailsStepProps) => {
  // Calcular préstamo cuando cambien los datos relevantes
  useEffect(() => {
    if (data.amount && data.numberOfPayments && data.paymentFrequency) {
      const amount = parseFloat(data.amount);
      const payments = parseInt(data.numberOfPayments);
      
      if (!isNaN(amount) && !isNaN(payments) && amount > 0 && payments > 0) {
        const calculation = calculateLoan(amount, payments, data.paymentFrequency);
        onChange({
          totalWithInterest: calculation.totalAmount.toFixed(2),
          paymentAmount: calculation.paymentAmount.toFixed(2)
        });
      }
    }
  }, [data.amount, data.numberOfPayments, data.paymentFrequency]);
  
  const calculation = data.amount && data.numberOfPayments && data.paymentFrequency
    ? calculateLoan(
        parseFloat(data.amount),
        parseInt(data.numberOfPayments),
        data.paymentFrequency
      )
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Datos del Préstamo</h2>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Monto Solicitado <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          value={data.amount}
          onChange={(e) => onChange({ amount: e.target.value })}
          placeholder="15000"
          min="0"
          step="100"
        />
        {errors?.amount && (
          <p className="text-xs text-destructive">{errors.amount}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="numberOfPayments">
          Número de Pagos <span className="text-destructive">*</span>
        </Label>
        <Input
          id="numberOfPayments"
          type="number"
          value={data.numberOfPayments}
          onChange={(e) => onChange({ numberOfPayments: e.target.value })}
          placeholder="12"
          min="1"
        />
        {errors?.numberOfPayments && (
          <p className="text-xs text-destructive">{errors.numberOfPayments}</p>
        )}
      </div>
      
      {data.numberOfPayments && parseInt(data.numberOfPayments) > 0 && (
        <div className="space-y-2">
          <Label htmlFor="paymentFrequency">
            Frecuencia de Pago <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.paymentFrequency}
            onValueChange={(value: 'biweekly' | 'monthly') => onChange({ paymentFrequency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="biweekly">Quincenal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
            </SelectContent>
          </Select>
          {errors?.paymentFrequency && (
            <p className="text-xs text-destructive">{errors.paymentFrequency}</p>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label>
          Fecha de Inicio de Pagos (Sábados únicamente) <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !data.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.startDate ? format(data.startDate, "PPP", { locale: es }) : "Selecciona un sábado"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.startDate || undefined}
              onSelect={(date) => onChange({ startDate: date || null })}
              disabled={(date) => !isSaturday(date) || date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors?.startDate && (
          <p className="text-xs text-destructive">{errors.startDate}</p>
        )}
      </div>
      
      {calculation && (
        <div className="mt-6 p-6 rounded-lg bg-gradient-card border border-border shadow-md">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Resumen del Préstamo
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Monto Solicitado:</span>
              <span className="text-base font-semibold text-foreground">
                {formatCurrency(calculation.requestedAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Interés (15%):</span>
              <span className="text-base font-semibold text-warning">
                {formatCurrency(calculation.interestAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b-2 border-primary/20 bg-primary/5 px-3 rounded">
              <span className="text-base font-medium text-foreground">Total a Pagar:</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(calculation.totalAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Número de Pagos:</span>
              <span className="text-base font-semibold text-foreground">
                {calculation.numberOfPayments} {calculation.frequency === 'biweekly' ? 'quincenas' : 'meses'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 bg-success/5 px-3 rounded">
              <span className="text-base font-medium text-foreground">
                Pago {calculation.frequency === 'biweekly' ? 'Quincenal' : 'Mensual'}:
              </span>
              <span className="text-xl font-bold text-success">
                {formatCurrency(calculation.paymentAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 pt-3">
              <span className="text-sm text-muted-foreground">Plazo Total:</span>
              <span className="text-base font-semibold text-foreground">
                {calculation.totalDays} días
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
