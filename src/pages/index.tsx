import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/LoanForm/ProgressBar";
import { ClientStep } from "@/components/LoanForm/steps/ClientStep";
import { AddressStep } from "@/components/LoanForm/steps/AddressStep";
import { WorkInfoStep } from "@/components/LoanForm/steps/WorkInfoStep";
import { GuarantorStep } from "@/components/LoanForm/steps/GuarantorStep";
import { LoanDetailsStep } from "@/components/LoanForm/steps/LoanDetailsStep";
import { PromoterStep } from "@/components/LoanForm/steps/PromoterStep";
import { SummaryStep } from "@/components/LoanForm/steps/SummaryStep";
import { ChevronLeft, ChevronRight, Send, FileText } from "lucide-react";
import { toast } from "sonner";
import { LoanFormData, STEPS, ClientData, AddressData, WorkData, GuarantorData, LoanDetailsData, PromoterData, SupervisorData, TokensData } from "@/types/loan";
import { isValidCurp } from "@/lib/curpValidator";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LoanFormData>({
    client: {
      curp: '',
      fullName: '',
      isDisabled: false,
      whatsapp: '',
      birthday: null,
      ine: null,
      score: null
    },
    clientAddress: {
      postalCode: '',
      neighborhood: '',
      street: '',
      exteriorNumber: '',
      crossStreets: '',
      city: '',
      housingType: 'owned' as const,
      timeAtAddress: ''
    },
    clientWork: {
      companyName: '',
      position: '',
      companyPhone: '',
      salary: ''
    },
    clientWorkAddress: {
      postalCode: '',
      neighborhood: '',
      street: '',
      exteriorNumber: '',
      crossStreets: '',
      city: ''
    },
    guarantor: {
      curp: '',
      fullName: '',
      whatsapp: '',
      relationship: '',
      score: null
    },
    guarantorAddress: {
      postalCode: '',
      neighborhood: '',
      street: '',
      exteriorNumber: '',
      crossStreets: '',
      city: ''
    },
    guarantorReference: {
      curp: '',
      fullName: '',
      whatsapp: '',
      relationship: '',
      score: null
    },
    guarantorWork: {
      companyName: '',
      position: '',
      companyPhone: '',
      salary: ''
    },
    guarantorWorkAddress: {
      postalCode: '',
      neighborhood: '',
      street: '',
      exteriorNumber: '',
      crossStreets: '',
      city: ''
    },
    loanDetails: {
      amount: '',
      numberOfPayments: '',
      paymentFrequency: '',
      startDate: null
    },
    promoter: {
      fullName: '',
      phone: '',
      email: '',
      route: ''
    },
    supervisor: {
      fullName: '',
      phone: '',
      email: ''
    },
    tokens: {
      promoterToken: '',
      supervisorToken: ''
    }
  });
  
  const [tokensData, setTokensData] = useState<TokensData>({
    promoterToken: '',
    supervisorToken: ''
  });
  
  // Validaciones por paso
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Cliente
        if (!isValidCurp(formData.client.curp)) {
          toast.error("CURP inválido");
          return false;
        }
        if (!formData.client.fullName.trim()) {
          toast.error("El nombre completo es requerido");
          return false;
        }
        if (formData.client.whatsapp.length !== 10) {
          toast.error("El WhatsApp debe tener 10 dígitos");
          return false;
        }
        if (!formData.client.birthday) {
          toast.error("La fecha de cumpleaños es requerida");
          return false;
        }
        if (!formData.client.ine) {
          toast.error("La foto del INE es requerida");
          return false;
        }
        return true;
        
      case 1: // Domicilio
        if (!formData.clientAddress.postalCode || formData.clientAddress.postalCode.length !== 5) {
          toast.error("Código postal inválido");
          return false;
        }
        if (!formData.clientAddress.neighborhood || !formData.clientAddress.street || 
            !formData.clientAddress.exteriorNumber || !formData.clientAddress.crossStreets || 
            !formData.clientAddress.city || !formData.clientAddress.housingType ||
            !formData.clientAddress.timeAtAddress) {
          toast.error("Todos los campos del domicilio son requeridos");
          return false;
        }
        return true;
        
      case 2: // Información Laboral
        if (!formData.clientWork.companyName || !formData.clientWork.position || 
            !formData.clientWork.salary) {
          toast.error("Todos los campos laborales son requeridos");
          return false;
        }
        if (formData.clientWork.companyPhone.length !== 10) {
          toast.error("El teléfono de la empresa debe tener 10 dígitos");
          return false;
        }
        return true;
        
      case 3: // Dirección Laboral
        if (!formData.clientWorkAddress.postalCode || formData.clientWorkAddress.postalCode.length !== 5) {
          toast.error("Código postal inválido");
          return false;
        }
        if (!formData.clientWorkAddress.neighborhood || !formData.clientWorkAddress.street || 
            !formData.clientWorkAddress.exteriorNumber || !formData.clientWorkAddress.crossStreets || 
            !formData.clientWorkAddress.city) {
          toast.error("Todos los campos de la dirección laboral son requeridos");
          return false;
        }
        return true;
        
      case 4: // Aval
        const existingCurps = [formData.client.curp];
        if (!isValidCurp(formData.guarantor.curp) || existingCurps.includes(formData.guarantor.curp)) {
          toast.error("CURP del aval inválido o duplicado");
          return false;
        }
        if (!formData.guarantor.fullName || !formData.guarantor.relationship) {
          toast.error("Nombre y parentesco del aval son requeridos");
          return false;
        }
        if (formData.guarantor.whatsapp.length !== 10) {
          toast.error("El WhatsApp debe tener 10 dígitos");
          return false;
        }
        return true;
        
      case 5: // Dirección Aval
        if (!formData.guarantorAddress.postalCode || formData.guarantorAddress.postalCode.length !== 5) {
          toast.error("Código postal inválido");
          return false;
        }
        if (!formData.guarantorAddress.neighborhood || !formData.guarantorAddress.street || 
            !formData.guarantorAddress.exteriorNumber || !formData.guarantorAddress.crossStreets || 
            !formData.guarantorAddress.city) {
          toast.error("Todos los campos del domicilio del aval son requeridos (excepto número interior)");
          return false;
        }
        return true;
        
      case 6: // Referencia
        const allCurps = [formData.client.curp, formData.guarantor.curp];
        if (!isValidCurp(formData.guarantorReference.curp) || allCurps.includes(formData.guarantorReference.curp)) {
          toast.error("CURP de la referencia inválido o duplicado");
          return false;
        }
        if (!formData.guarantorReference.fullName || !formData.guarantorReference.relationship) {
          toast.error("Nombre y parentesco de la referencia son requeridos");
          return false;
        }
        if (formData.guarantorReference.whatsapp.length !== 10) {
          toast.error("El WhatsApp debe tener 10 dígitos");
          return false;
        }
        return true;
        
      case 7: // Información Laboral Aval
        if (!formData.guarantorWork.companyName || !formData.guarantorWork.position || 
            !formData.guarantorWork.salary) {
          toast.error("Todos los campos laborales del aval son requeridos");
          return false;
        }
        if (formData.guarantorWork.companyPhone.length !== 10) {
          toast.error("El teléfono de la empresa debe tener 10 dígitos");
          return false;
        }
        return true;
        
      case 8: // Dirección Laboral Aval
        if (!formData.guarantorWorkAddress.postalCode || formData.guarantorWorkAddress.postalCode.length !== 5) {
          toast.error("Código postal inválido");
          return false;
        }
        if (!formData.guarantorWorkAddress.neighborhood || !formData.guarantorWorkAddress.street || 
            !formData.guarantorWorkAddress.exteriorNumber || !formData.guarantorWorkAddress.crossStreets || 
            !formData.guarantorWorkAddress.city) {
          toast.error("Todos los campos de la dirección laboral son requeridos");
          return false;
        }
        return true;
        
      case 9: // Datos del Préstamo
        if (!formData.loanDetails.amount || parseFloat(formData.loanDetails.amount) <= 0) {
          toast.error("El monto solicitado debe ser mayor a 0");
          return false;
        }
        if (!formData.loanDetails.numberOfPayments || parseInt(formData.loanDetails.numberOfPayments) <= 0) {
          toast.error("El número de pagos debe ser mayor a 0");
          return false;
        }
        if (!formData.loanDetails.paymentFrequency) {
          toast.error("Selecciona la frecuencia de pago");
          return false;
        }
        if (!formData.loanDetails.startDate) {
          toast.error("Selecciona una fecha de inicio (debe ser sábado)");
          return false;
        }
        return true;
        
      case 10: // Promotora y Supervisora
        if (!formData.promoter.fullName || !formData.promoter.route) {
          toast.error("Información de la promotora incompleta");
          return false;
        }
        if (formData.promoter.phone.length !== 10) {
          toast.error("El teléfono de la promotora debe tener 10 dígitos");
          return false;
        }
        if (!formData.promoter.email.includes('@')) {
          toast.error("Email de promotora inválido");
          return false;
        }
        if (!formData.supervisor.fullName) {
          toast.error("Información de la supervisora incompleta");
          return false;
        }
        if (formData.supervisor.phone.length !== 10) {
          toast.error("El teléfono de la supervisora debe tener 10 dígitos");
          return false;
        }
        if (!formData.supervisor.email.includes('@')) {
          toast.error("Email de supervisora inválido");
          return false;
        }
        return true;
        
      case 11: // Resumen
        if (tokensData.promoterToken.length !== 4) {
          toast.error("El token de promotora debe tener 4 dígitos");
          return false;
        }
        if (tokensData.supervisorToken.length !== 4) {
          toast.error("El token de supervisora debe tener 4 dígitos");
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;
    
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", { ...formData, tokens: tokensData });
    toast.success("¡Solicitud enviada correctamente!", {
      description: "En breve nos pondremos en contacto contigo."
    });
  };
  
  const existingCurps = [
    formData.client.curp,
    formData.guarantor.curp
  ].filter(Boolean);
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Solicitud de Crédito
            </h1>
          </div>
          <p className="text-muted-foreground">
            Completa todos los campos para procesar tu solicitud
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>
        
        {/* Form Card */}
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 border border-border">
          {/* Step Content */}
          <div className="min-h-[500px]">
            {currentStep === 0 && (
              <ClientStep
                data={formData.client}
                onChange={(data) => setFormData({ ...formData, client: { ...formData.client, ...data } })}
              />
            )}
            
            {currentStep === 1 && (
              <AddressStep
                data={formData.clientAddress}
                onChange={(data) => setFormData({ ...formData, clientAddress: { ...formData.clientAddress, ...data } })}
                title="Domicilio"
              />
            )}
            
            {currentStep === 2 && (
              <WorkInfoStep
                data={formData.clientWork}
                onChange={(data) => setFormData({ ...formData, clientWork: { ...formData.clientWork, ...data } })}
              />
            )}
            
            {currentStep === 3 && (
              <AddressStep
                data={formData.clientWorkAddress}
                onChange={(data) => setFormData({ ...formData, clientWorkAddress: { ...formData.clientWorkAddress, ...data } })}
                title="Dirección Donde Labora"
              />
            )}
            
            {currentStep === 4 && (
              <GuarantorStep
                data={formData.guarantor}
                onChange={(data) => setFormData({ ...formData, guarantor: { ...formData.guarantor, ...data } })}
                existingCurps={[formData.client.curp]}
              />
            )}
            
            {currentStep === 5 && (
              <AddressStep
                data={formData.guarantorAddress}
                onChange={(data) => setFormData({ ...formData, guarantorAddress: { ...formData.guarantorAddress, ...data } })}
                title="Dirección del Aval"
              />
            )}
            
            {currentStep === 6 && (
              <GuarantorStep
                data={formData.guarantorReference}
                onChange={(data) => setFormData({ ...formData, guarantorReference: { ...formData.guarantorReference, ...data } })}
                existingCurps={existingCurps}
                title="Referencia del Aval"
                isReference
              />
            )}
            
            {currentStep === 7 && (
              <WorkInfoStep
                data={formData.guarantorWork}
                onChange={(data) => setFormData({ ...formData, guarantorWork: { ...formData.guarantorWork, ...data } })}
                title="Información Laboral del Aval"
              />
            )}
            
            {currentStep === 8 && (
              <AddressStep
                data={formData.guarantorWorkAddress}
                onChange={(data) => setFormData({ ...formData, guarantorWorkAddress: { ...formData.guarantorWorkAddress, ...data } })}
                title="Dirección Laboral del Aval"
              />
            )}
            
            {currentStep === 9 && (
              <LoanDetailsStep
                data={formData.loanDetails}
                onChange={(data) => setFormData({ ...formData, loanDetails: { ...formData.loanDetails, ...data } })}
              />
            )}
            
            {currentStep === 10 && (
              <PromoterStep
                promoterData={formData.promoter}
                supervisorData={formData.supervisor}
                onPromoterChange={(data) => setFormData({ ...formData, promoter: { ...formData.promoter, ...data } })}
                onSupervisorChange={(data) => setFormData({ ...formData, supervisor: { ...formData.supervisor, ...data } })}
              />
            )}
            
            {currentStep === 12 && (
              <SummaryStep
                data={formData}
                tokensData={tokensData}
                onTokensChange={(data) => setTokensData({ ...tokensData, ...data })}
              />
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="gap-2 bg-gradient-primary"
              >
                <Send className="h-4 w-4" />
                Enviar Solicitud
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Todos tus datos están protegidos y son confidenciales</p>
        </div>
      </div>
    </div>
  );
};

export default Index;