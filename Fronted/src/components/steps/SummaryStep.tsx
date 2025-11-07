import { LoanFormData, TokensData } from "@/types/loan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScoreIndicator } from "../ScoreIndicator";
import { FileText, User, Shield, DollarSign, Key } from "lucide-react";
import { formatCurrency } from "@/lib/loanCalculator";

interface SummaryStepProps {
  data: LoanFormData;
  tokensData: TokensData;
  onTokensChange: (data: Partial<TokensData>) => void;
  errors?: Record<string, string>;
}

export const SummaryStep = ({ data, tokensData, onTokensChange, errors }: SummaryStepProps) => {
  const totalDays = data.loanDetails.paymentFrequency === 'biweekly'
    ? parseInt(data.loanDetails.numberOfPayments) * 15
    : parseInt(data.loanDetails.numberOfPayments) * 30;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Resumen de Solicitud</h2>
      </div>
      
      {/* Cliente */}
      <div className="p-6 rounded-lg bg-gradient-card border border-border shadow-md space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cliente</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="text-base font-medium text-foreground">{data.client.fullName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">CURP</p>
            <div className="flex items-center gap-2">
              <p className="text-base font-medium text-foreground">{data.client.curp}</p>
              {data.client.score && <ScoreIndicator score={data.client.score} />}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">WhatsApp</p>
            <p className="text-base font-medium text-foreground">{data.client.whatsapp}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Empresa</p>
            <p className="text-base font-medium text-foreground">{data.clientWork.companyName}</p>
          </div>
        </div>
      </div>
      
      {/* Aval */}
      <div className="p-6 rounded-lg bg-gradient-card border border-border shadow-md space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Aval</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="text-base font-medium text-foreground">{data.guarantor.fullName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">CURP</p>
            <div className="flex items-center gap-2">
              <p className="text-base font-medium text-foreground">{data.guarantor.curp}</p>
              {data.guarantor.score && <ScoreIndicator score={data.guarantor.score} />}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Parentesco</p>
            <p className="text-base font-medium text-foreground">{data.guarantor.relationship}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">WhatsApp</p>
            <p className="text-base font-medium text-foreground">{data.guarantor.whatsapp}</p>
          </div>
        </div>
      </div>
      
      {/* Préstamo */}
      <div className="p-6 rounded-lg bg-gradient-primary border border-primary shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-primary-light">
          <DollarSign className="h-5 w-5 text-primary-foreground" />
          <h3 className="text-lg font-semibold text-primary-foreground">Datos del Préstamo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-primary-foreground/80">Monto Solicitado</p>
            <p className="text-xl font-bold text-primary-foreground">
              {formatCurrency(parseFloat(data.loanDetails.amount))}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-primary-foreground/80">Total a Pagar</p>
            <p className="text-xl font-bold text-primary-foreground">
              {formatCurrency(parseFloat(data.loanDetails.totalWithInterest || '0'))}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-primary-foreground/80">Plazo</p>
            <p className="text-base font-medium text-primary-foreground">
              {data.loanDetails.numberOfPayments} {data.loanDetails.paymentFrequency === 'biweekly' ? 'quincenas' : 'meses'}
              {' '}({totalDays} días)
            </p>
          </div>
          
          <div>
            <p className="text-sm text-primary-foreground/80">Pago {data.loanDetails.paymentFrequency === 'biweekly' ? 'Quincenal' : 'Mensual'}</p>
            <p className="text-xl font-bold text-primary-foreground">
              {formatCurrency(parseFloat(data.loanDetails.paymentAmount || '0'))}
            </p>
          </div>
        </div>
      </div>
      
      {/* Promotora */}
      <div className="p-6 rounded-lg bg-gradient-card border border-border shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Promotora</p>
            <p className="text-base font-medium text-foreground">{data.promoter.fullName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Ruta</p>
            <p className="text-base font-medium text-foreground">{data.promoter.route}</p>
          </div>
        </div>
      </div>
      
      {/* Tokens de Autorización */}
      <div className="p-6 rounded-lg bg-warning/10 border-2 border-warning shadow-lg space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-warning">
          <Key className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Tokens de Autorización</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Para completar la solicitud, la promotora y supervisora deben ingresar sus tokens de 4 dígitos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="promoterToken">
              Token de Promotora <span className="text-destructive">*</span>
            </Label>
            <Input
              id="promoterToken"
              type="password"
              value={tokensData.promoterToken}
              onChange={(e) => onTokensChange({ promoterToken: e.target.value.replace(/\D/g, '') })}
              placeholder="****"
              maxLength={4}
              className="text-center text-xl font-bold tracking-widest"
            />
            {errors?.promoterToken && (
              <p className="text-xs text-destructive">{errors.promoterToken}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supervisorToken">
              Token de Supervisora <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supervisorToken"
              type="password"
              value={tokensData.supervisorToken}
              onChange={(e) => onTokensChange({ supervisorToken: e.target.value.replace(/\D/g, '') })}
              placeholder="****"
              maxLength={4}
              className="text-center text-xl font-bold tracking-widest"
            />
            {errors?.supervisorToken && (
              <p className="text-xs text-destructive">{errors.supervisorToken}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-4 bg-warning/5 rounded-lg border border-warning/20">
          <Key className="h-4 w-4 text-warning flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Los tokens son necesarios para validar y enviar la solicitud. Sin ambos tokens no será posible procesar el crédito.
          </p>
        </div>
      </div>
    </div>
  );
};
