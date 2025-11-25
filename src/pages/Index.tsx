import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/LoanForm/ProgressBar";
import { ClientStep } from "@/components/LoanForm/steps/ClientStep";
import { AddressStep } from "@/components/LoanForm/steps/AddressStep";
import { WorkInfoStep } from "@/components/LoanForm/steps/WorkInfoStep";
import { GuarantorStep } from "@/components/LoanForm/steps/GuarantorStep";
import { LoanDetailsStep } from "@/components/LoanForm/steps/LoanDetailsStep";
import { PromoterStep } from "@/components/LoanForm/steps/PromoterStep";
import { SummaryStep } from "@/components/LoanForm/steps/SummaryStep";
import { ChevronLeft, ChevronRight, Send, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LoanFormData, STEPS, REGISTER_STEPS, LOAN_STEPS, TokensData
} from "@/types/loan";
import { isValidCurp } from "@/lib/curpValidator";

// Definir la URL de la API usando la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") as 'register' | 'loan' | null;

  const [currentStep, setCurrentStep] = useState(0);
  const [loanCurp, setLoanCurp] = useState("");
  const [isCurpValidated, setIsCurpValidated] = useState(false);
  const [, setLoadingCurp] = useState<boolean>(false);
  const [, setCurpError] = useState<string | null>(null);


  const [formData, setFormData] = useState<LoanFormData>({
    client: {
      curp: '',
      nombre_completo: '',
      prioritario: false,
      whatsapp: '',
      celular: '',
      cumpleanos: null,
      ine: null,
      redes_sociales: '',
      red_social: 'otro',
      score: null,
      sueldo: 0,
      banco: '',
      clabe: '',
      cuenta: ''
    },

    clientAddress: {
      cp: '',
      colonia: '',
      calle: '',
      ciudad: '',
      numero_ext: '',
      numero_int: '',
      cruces: '',
      maps: '',
      vivienda: '',
      score_zona: '',
      tiempo: '',
      tipo: 'cliente'
    },

    clientWork: {
      empresa: '',
      puesto: '',
      telefono: '',
      tipo: 'cliente',
      direccion: {
        cp: '',
        colonia: '',
        calle: '',
        ciudad: '',
        numero_ext: '',
        numero_int: '',
        cruces: '',
        maps: '',
        vivienda: '',
        score_zona: '',
        tiempo: '',
        tipo: 'cliente'
      }
    },

    clientWorkAddress: {
      cp: '',
      colonia: '',
      calle: '',
      ciudad: '',
      numero_ext: '',
      numero_int: '',
      cruces: '',
      maps: '',
      vivienda: '',
      score_zona: '',
      tiempo: '',
      tipo: 'cliente'
    },

    guarantor: {
      curp: '',
      nombre_completo: '',
      whatsapp: '',
      parentesco: '',
      score: null,
      direccion: {
        cp: '',
        colonia: '',
        calle: '',
        ciudad: '',
        numero_ext: '',
        numero_int: '',
        cruces: '',
        maps: '',
        vivienda: '',
        score_zona: '',
        tiempo: '',
        tipo: 'aval'
      },
      laboral: {
        empresa: '',
        puesto: '',
        telefono: '',
        tipo: 'aval',
        direccion: {
          cp: '',
          colonia: '',
          calle: '',
          ciudad: '',
          numero_ext: '',
          numero_int: '',
          cruces: '',
          maps: '',
          vivienda: '',
          score_zona: '',
          tiempo: '',
          tipo: 'aval'
        }
      }
    },

    guarantorAddress: {
      cp: '',
      colonia: '',
      calle: '',
      ciudad: '',
      numero_ext: '',
      numero_int: '',
      cruces: '',
      maps: '',
      vivienda: '',
      score_zona: '',
      tiempo: '',
      tipo: 'aval'
    },

    guarantorReference: {
      curp: '',
      nombre_completo: '',
      whatsapp: '',
      parentesco: '',
      score: null,
      direccion: {
        cp: '',
        colonia: '',
        calle: '',
        ciudad: '',
        numero_ext: '',
        numero_int: '',
        cruces: '',
        maps: '',
        vivienda: '',
        score_zona: '',
        tiempo: '',
        tipo: 'referencia'
      },
      laboral: {
        empresa: '',
        puesto: '',
        telefono: '',
        tipo: 'referencia',
        direccion: {
          cp: '',
          colonia: '',
          calle: '',
          ciudad: '',
          numero_ext: '',
          numero_int: '',
          cruces: '',
          maps: '',
          vivienda: '',
          score_zona: '',
          tiempo: '',
          tipo: 'referencia'
        }
      }
    },

    guarantorWork: {
      empresa: '',
      puesto: '',
      telefono: '',
      tipo: 'aval',
      direccion: {
        cp: '',
        colonia: '',
        calle: '',
        ciudad: '',
        numero_ext: '',
        numero_int: '',
        cruces: '',
        maps: '',
        vivienda: '',
        score_zona: '',
        tiempo: '',
        tipo: 'aval'
      }
    },

    guarantorReferenceWork: {
      empresa: '',
      puesto: '',
      telefono: '',
      tipo: 'referencia',
      direccion: {
        cp: '',
        colonia: '',
        calle: '',
        ciudad: '',
        numero_ext: '',
        numero_int: '',
        cruces: '',
        maps: '',
        vivienda: '',
        score_zona: '',
        tiempo: '',
        tipo: 'referencia'
      }
    },

    guarantorWorkAddress: {
      cp: '',
      colonia: '',
      calle: '',
      ciudad: '',
      numero_ext: '',
      numero_int: '',
      cruces: '',
      maps: '',
      vivienda: '',
      score_zona: '',
      tiempo: '',
      tipo: 'aval'
    },

    loanDetails: {
      amount: '',
      numberOfPayments: '',
      paymentFrequency: '',
      startDate: null
    },

    promoter: {
      nombre: '',
      ruta: ''
    },

    supervisor: {
      nombre_completo: '',
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

  useEffect(() => {
    if (!mode) {
      navigate("/");
    }
    // If loan mode, we start at a special step, or we can handle it via conditional rendering
    if (mode === 'loan') {
      // Logic for loan mode initialization if needed
    }
  }, [mode, navigate]);

  // --- VALIDACIÓN AUTOMÁTICA DEL CURP PARA PRÉSTAMO ---
  useEffect(() => {
    // Solo validar si estamos en modo registrar
    if (mode !== "register") return;

    const curp = formData.client.curp.trim().toUpperCase();

    // CURP incompleto → no validar aún
    if (curp.length !== 18) return;

    // CURP inválido → no consultar backend
    if (!isValidCurp(curp)) return;

    // Debounce de 700ms
    const timeout = setTimeout(async () => {
      try {
        const resp = await fetch(`${API_URL}/cliente/curp/${curp}`);
        const data = await resp.json();

        console.log("Validación registro:", data);

        if (data.found === true) {
          toast.error("Este usuario ya está registrado.");

          navigate(`/form?mode=loan&curp=${curp}`);
          setIsCurpValidated(false);
        } else {
          toast.success("CURP disponible.");
          setIsCurpValidated(true);
        }
      } catch (err) {
        console.error(err);
        toast.error("No se pudo validar el CURP.");
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [formData.client.curp, mode]);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const curpFromUrl = searchParams.get("curp");

    if (mode === "loan" && curpFromUrl) {
      const formattedCurp = curpFromUrl.toUpperCase();

      // Autollenar el input
      setLoanCurp(formattedCurp);

    }

  }, [searchParams]);


  // Función para normalizar y aplanar los datos del formulario al formato del DTO de NestJS
  const normalizeFormData = (data: LoanFormData, tokens: TokensData) => {
    const clientData = {
      // -------------------------
      // CAMPOS DE NIVEL RAÍZ (OBLIGATORIOS)
      // -------------------------
      curp: data.client.curp,
      nombre_completo: data.client.nombre_completo,
      prioritario: data.client.prioritario ?? false,
      whatsapp: data.client.whatsapp,
      celular: data.client.celular || "",

      // ✅ CAMPOS OBLIGATORIOS QUE FALTABAN
      estado: "activo",
      calificacion: 5, // número, no string
      categoria: "D",

      cumpleanos: data.client.cumpleanos ? 
        new Date(data.client.cumpleanos).toISOString().split('T')[0] : 
        null,
      redes_sociales: data.client.redes_sociales || "",
      red_social: data.client.red_social || "",

      // ✅ Asegurar que sean números
      sueldo: Number(data.client.sueldo) || 0,
      
      banco: data.client.banco || "",
      clabe: data.client.clabe || "",
      cuenta: data.client.cuenta || "",

      // ⚠ INE se envía por separado en FormData
      ine: "", // Este campo va vacío, el archivo se envía aparte

      // -------------------------
      // DIRECCIÓN DEL CLIENTE (CORREGIDO)
      // -------------------------
      direccion: {
        cp: data.clientAddress.cp || "",
        colonia: data.clientAddress.colonia || "",
        calle: data.clientAddress.calle || "",
        ciudad: data.clientAddress.ciudad || "",
        numero_ext: data.clientAddress.numero_ext || "",
        numero_int: data.clientAddress.numero_int || "",
        cruces: data.clientAddress.cruces || "",
        maps: data.clientAddress.maps || "",
        vivienda: data.clientAddress.vivienda || "",
        score_zona: data.clientAddress.score_zona || "5",
        tiempo: data.clientAddress.tiempo || "",
        tipo: "cliente"
      },

      // -------------------------
      // LABORAL CLIENTE (CORREGIDO)
      // -------------------------
      laboral: {
        empresa: data.clientWork.empresa || "",
        puesto: data.clientWork.puesto || "",
        telefono: data.clientWork.telefono || "",
        tipo: "cliente",
        direccion: {
          cp: data.clientWorkAddress.cp || "",
          colonia: data.clientWorkAddress.colonia || "",
          calle: data.clientWorkAddress.calle || "",
          numero_ext: data.clientWorkAddress.numero_ext || "",
          numero_int: data.clientWorkAddress.numero_int || "",
          cruces: data.clientWorkAddress.cruces || "",
          ciudad: data.clientWorkAddress.ciudad || "",
          maps: data.clientWorkAddress.maps || "",
          vivienda: data.clientWorkAddress.vivienda || "",
          score_zona: data.clientWorkAddress.score_zona || 5,
          tiempo: data.clientWorkAddress.tiempo || "",
          tipo: "cliente"
        }
      },

      // -------------------------
      // AVAL (CORREGIDO)
      // -------------------------
      aval: {
        curp: data.guarantor.curp || "",
        nombre_completo: data.guarantor.nombre_completo || "",
        parentesco: data.guarantor.parentesco || "",
        whatsapp: data.guarantor.whatsapp || "",
        score_riesgo: "5", // ✅ Campo requerido

        direccion: {
          cp: data.guarantorAddress.cp || "",
          colonia: data.guarantorAddress.colonia || "",
          calle: data.guarantorAddress.calle || "",
          ciudad: data.guarantorAddress.ciudad || "",
          numero_ext: data.guarantorAddress.numero_ext || "",
          numero_int: data.guarantorAddress.numero_int || "",
          cruces: data.guarantorAddress.cruces || "",
          maps: data.guarantorAddress.maps || "",
          vivienda: data.guarantorAddress.vivienda || "",
          score_zona: data.guarantorAddress.score_zona || "5",
          tiempo: data.guarantorAddress.tiempo || "",
          tipo: "aval"
        },

        laboral: {
          empresa: data.guarantorWork.empresa || "",
          puesto: data.guarantorWork.puesto || "",
          telefono: data.guarantorWork.telefono || "",
          tipo: "aval",
          direccion: {
            cp: data.guarantor.laboral?.direccion?.cp || "",
            colonia: data.guarantor.laboral?.direccion?.colonia || "",
            calle: data.guarantor.laboral?.direccion?.calle || "",
            numero_ext: data.guarantor.laboral?.direccion?.numero_ext || "",
            numero_int: data.guarantor.laboral?.direccion?.numero_int || "",
            cruces: data.guarantor.laboral?.direccion?.cruces || "",
            ciudad: data.guarantor.laboral?.direccion?.ciudad || "",
            maps: data.guarantor.laboral?.direccion?.maps || "",
            vivienda: data.guarantor.laboral?.direccion?.vivienda || "",
            score_zona: data.guarantor.laboral?.direccion?.score_zona || "5",
            tiempo: data.guarantor.laboral?.direccion?.tiempo || "",
            tipo: "aval"
          }
        }
      },

      // -------------------------
      // REFERENCIA (CORREGIDO)
      // -------------------------
      referencia: {
        nombre_completo: data.guarantorReference.nombre_completo || "",
        curp: data.guarantorReference.curp || "",
        whatsapp: data.guarantorReference.whatsapp || "",
        parentesco: data.guarantorReference.parentesco || "",

        direccion: {
          cp: data.guarantorAddress.cp || "",
          colonia: data.guarantorAddress.colonia || "",
          calle: data.guarantorAddress.calle || "",
          numero_ext: data.guarantorAddress.numero_ext || "",
          numero_int: data.guarantorAddress.numero_int || "",
          ciudad: data.guarantorAddress.ciudad || "",
          cruces: data.guarantorAddress.cruces || "",
          maps: data.guarantorAddress.maps || "",
          vivienda: data.guarantorAddress.vivienda || "",
          score_zona: data.guarantorAddress.score_zona || "5",
          tiempo: data.guarantorAddress.tiempo || "",
          tipo: "referencia"
        },

        laboral: {
          empresa: data.guarantorReferenceWork.empresa || "",
          puesto: data.guarantorReferenceWork.puesto || "",
          telefono: data.guarantorReferenceWork.telefono || "",
          tipo: "referencia",
          direccion: {
            cp: data.guarantorReference.laboral?.direccion?.cp || "",
            colonia: data.guarantorReference.laboral?.direccion?.colonia || "",
            ciudad: data.guarantorReference.laboral?.direccion?.ciudad || "",
            calle: data.guarantorReference.laboral?.direccion?.calle || "",
            numero_ext: data.guarantorReference.laboral?.direccion?.numero_ext || "",
            numero_int: data.guarantorReference.laboral?.direccion?.numero_int || "",
            cruces: data.guarantorReference.laboral?.direccion?.cruces || "",
            maps: data.guarantorReference.laboral?.direccion?.maps || "",
            vivienda: data.guarantorReference.laboral?.direccion?.vivienda || "",
            score_zona: data.guarantorReference.laboral?.direccion?.score_zona || "5",
            tiempo: data.guarantorReference.laboral?.direccion?.tiempo || "",
            tipo: "referencia"
          }
        }
      },

      // -------------------------
      // PROMOTORA (CORREGIDO)
      // -------------------------
      promotora: {
        nombre: data.promoter.nombre || "",
        ruta: data.promoter.ruta || ""
      }
    };

    return clientData;
  };

  useEffect(() => {
    console.log('Estado actual del formulario:', {
      currentStep,
      formData: {
        client: !!formData.client.curp,
        address: !!formData.clientAddress.cp,
        work: !!formData.clientWork.empresa,
        guarantor: !!formData.guarantor.curp,
        guarantorAddress: !!formData.guarantorAddress.cp,
        promoter: !!formData.promoter.nombre
      }
    });
  }, [currentStep, formData]);


  // Validaciones por paso (se mantiene el código original)
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Cliente (Validación extendida para nuevos campos)
        if (!isValidCurp(formData.client.curp)) {
          toast.error("CURP inválido");
          return false;
        }
        if (!formData.client.nombre_completo.trim()) {
          toast.error("El nombre completo es requerido");
          return false;
        }
        if (formData.client.whatsapp.length !== 10) {
          toast.error("El WhatsApp debe tener 10 dígitos");
          return false;
        }
        if (!formData.client.cumpleanos) {
          toast.error("La fecha de cumpleaños es requerida");
          return false;
        }
        if (!formData.client.ine) {
          toast.error("La foto del INE es requerida");
          return false;
        }

        if (!formData.client.sueldo || formData.client.sueldo <= 0) {
          toast.error("El sueldo debe ser mayor a 0");
          return false;
        }
        if (!formData.client.banco.trim()) {
          toast.error("El nombre del banco es requerido");
          return false;
        }
        if (formData.client.clabe.length !== 18) {
          toast.error("La CLABE debe tener 18 dígitos");
          return false;
        }
        if (!formData.client.cuenta.trim()) {
          toast.error("El número de cuenta es requerido");
          return false;
        }
        // FIN NUEVAS VALIDACIONES
        return true;

      case 1: // Domicilio
        if (!formData.clientAddress.cp || formData.clientAddress.cp.length !== 5) {
          toast.error("Código postal inválido");
          return false;
        }
        if (!formData.clientAddress.colonia || !formData.clientAddress.calle ||
          !formData.clientAddress.numero_ext || !formData.clientAddress.cruces ||
          !formData.clientAddress.ciudad || !formData.clientAddress.tipo ||
          !formData.clientAddress.tiempo) {
          toast.error("Todos los campos del domicilio son requeridos");
          return false;
        }
        return true;

      case 2: // Información Laboral
        if (!formData.clientWork.empresa || !formData.clientWork.puesto) {
          toast.error("Todos los campos laborales son requeridos");
          return false;
        }
        if (formData.clientWork.telefono.length !== 10) {
          toast.error("El teléfono de la empresa debe tener 10 dígitos");
          return false;
        }
        return true;

      case 3: // Dirección Laboral
        if (!formData.clientWorkAddress.cp || formData.clientWorkAddress.cp.length !== 5) {
          toast.error("Código postal inválido");
          return false;
        }
        if (!formData.clientWorkAddress.colonia || !formData.clientWorkAddress.calle ||
          !formData.clientWorkAddress.numero_ext || !formData.clientWorkAddress.cruces ||
          !formData.clientWorkAddress.ciudad) {
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
        if (!formData.guarantor.nombre_completo || !formData.guarantor.parentesco) {
          toast.error("Nombre y parentesco del aval son requeridos");
          return false;
        }
        if (formData.guarantor.whatsapp.length !== 10) {
          toast.error("El WhatsApp debe tener 10 dígitos");
          return false;
        }
        return true;

      case 5: // Domicilio Aval
        if (!formData.guarantorAddress.cp || formData.guarantorAddress.cp.length !== 5) {
          toast.error("Código postal inválido");
          return false;
        }
        if (!formData.guarantorAddress.colonia || !formData.guarantorAddress.calle ||
          !formData.guarantorAddress.numero_ext || !formData.guarantorAddress.cruces ||
          !formData.guarantorAddress.ciudad || !formData.guarantorAddress.tipo ||
          !formData.guarantorAddress.tiempo) {
          toast.error("Todos los campos del domicilio son requeridos");
          return false;
        }
        return true;

      case 6: // Dirección laboral Aval
        if (!formData.guarantorWork.empresa || !formData.guarantorWork.puesto) {
          toast.error("Todos los campos laborales del aval son requeridos");
          return false;
        }
        if (formData.guarantorWork.telefono.length !== 10) {
          toast.error("El teléfono de la empresa debe tener 10 dígitos");
          return false;
        }
        return true;

      case 7: // Referencia
        const allCurps = [formData.client.curp, formData.guarantor.curp];
        if (!isValidCurp(formData.guarantorReference.curp) || allCurps.includes(formData.guarantorReference.curp)) {
          toast.error("CURP de la referencia inválido o duplicado");
          return false;
        }
        if (!formData.guarantorReference.nombre_completo || !formData.guarantorReference.parentesco) {
          toast.error("Nombre y parentesco de la referencia son requeridos");
          return false;
        }
        if (formData.guarantorReference.whatsapp.length !== 10) {
          toast.error("El WhatsApp debe tener 10 dígitos");
          return false;
        }
        return true;

      case 8: // Información Laboral de la Referencia
        if (!formData.guarantorReferenceWork.empresa || !formData.guarantorReferenceWork.puesto) {
          toast.error("Todos los campos laborales de la referencia son requeridos");
          return false;
        }
        if (formData.guarantorReferenceWork.telefono.length !== 10) {
          toast.error("El teléfono de la empresa debe tener 10 dígitos");
          return false;
        }
        return true;

      case 9: // Promotora y Supervisora (was 9)
        if (!formData.promoter.nombre || !formData.promoter.ruta) {
          toast.error("Información de la promotora incompleta");
          return false;
        }
        return true;

      case 10: // Datos del Préstamo (was 8)
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

  const handleRegisterSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // 1. Normalizar los datos
      const payload = normalizeFormData(formData, tokensData);
      
      console.log("Payload a enviar:", JSON.stringify(payload, null, 2)); // Para debug

      // 2. Crear FormData
      const formDataToSend = new FormData();

      // 3. Agregar archivo INE si existe
      if (formData.client?.ine) {
        formDataToSend.append("ine", formData.client.ine);
      } else {
        // Si no hay archivo, enviar un campo vacío
        formDataToSend.append("ine", new Blob(), "");
      }

      // 4. Agregar datos como JSON stringificado
      formDataToSend.append("data", JSON.stringify(payload));

      // 5. Verificar qué se está enviando (para debug) - CORREGIDO
      console.log("FormData contents:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // 6. Enviar al backend
      const response = await fetch(`${API_URL}/cliente`, {
        method: "POST",
        body: formDataToSend, // ✅ Sin headers para FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del backend:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Respuesta exitosa:", result);

      toast.success("¡Solicitud enviada correctamente!");
      navigate("/");

    } catch (error) {
      console.error("❌ Error completo:", error);
      toast.error("Error al enviar: " + (error instanceof Error ? error.message : "Error desconocido"));
    }
  };

  

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    // Normalizar y aplanar los datos al formato DTO del backend
    const payload = normalizeFormData(formData, tokensData);

    try {
      // ⚠️ NOTA: El manejo de la subida de archivos (INE) requiere un FormData
      // En este ejemplo, el archivo se ignora o se envía solo el nombre.
      // Si el backend espera el archivo, debes usar FormData.

      const response = await fetch(`${API_URL}/cliente`, { // Endpoint de creación de cliente
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Podrías necesitar un 'Authorization' token aquí
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del Backend:", errorData);
        throw new Error(errorData.message || 'Error al enviar la solicitud');
      }

      const result = await response.json();
      console.log("Respuesta exitosa del Backend:", result);

      toast.success("¡Solicitud enviada correctamente!", {
        description: "En breve nos pondremos en contacto contigo."
      });

      navigate("/");

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Fallo el envío de la solicitud.", {
        description: error instanceof Error ? error.message : "Hubo un error desconocido en la conexión."
      });
    }
  };

  const handleCurpValidation = async () => {
    setCurpError(null);

    const normalizedCurp = loanCurp.trim().toUpperCase();
    if (!isValidCurp(normalizedCurp)) {
      setCurpError("CURP inválido");
      toast.error("CURP inválido");
      return;
    }

    setLoadingCurp(true);

    try {
    // Timeout manual usando AbortController
      const controller = new AbortController();

      const resp = await fetch(`${API_URL}/cliente/curp/${normalizedCurp}`, {
        method: "GET",
        signal: controller.signal
      });

      if (!resp.ok) {
        throw new Error("No se encontró información con esa CURP");
      }

      const data = await resp.json();
      console.log("Datos del cliente:", data);
      console.log(data.found)

      if(data.found === false){
        throw new Error("No se encontró información con esa CURP");
      }

      setIsCurpValidated(true);

      setCurrentStep(9); // Saltar al paso 9 (Loan Details)
      setFormData(prev => ({
        ...prev,
        client: {
          ...prev.client,
          curp: loanCurp
        }
      }));
      toast.success("CURP validada correctamente");

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setCurpError("La petición tardó demasiado. Intenta de nuevo.");
        toast.error("La petición tardó demasiado. Intenta de nuevo.");
      } else {
        const m = err instanceof Error ? err.message : "Error al validar CURP";
        setCurpError(m);
        toast.error(m);
      }
    } finally {
      setLoadingCurp(false);
    }
  };

  const existingCurps = [
    formData.client.curp,
    formData.guarantor.curp
  ].filter(Boolean);

  // Render logic for Loan Mode - Initial CURP Step
  if (mode === 'loan' && !isCurpValidated) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center" style={{ backgroundColor: "#D6D6D5" }}>
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-md w-full border border-border">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Solicitar Préstamo</h2>
            <p className="text-muted-foreground">Ingresa tu CURP para continuar</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanCurp">CURP</Label>
              <div className="relative">
                <Input
                  id="loanCurp"
                  value={loanCurp}
                  onChange={(e) => setLoanCurp(e.target.value.toUpperCase())}
                  placeholder="CURP del cliente"
                  maxLength={18}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                Cancelar
              </Button>
              <Button className="w-full" onClick={handleCurpValidation}>
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#D6D6D5" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative text-center mb-12">
          <div className="flex flex-col items-center justify-center gap-2">
            <FileText className="h-12 w-12 text-black/70" />
            <h1 className="text-2xl md:text-5xl font-extrabold text-black/50 drop-shadow-lg">
              {mode === 'register' ? 'Registro de Cliente' : 'Solicitud de Préstamo'}
            </h1>
            <p className="text-black/50 text-lg md:text-m max-w-md">
              Completa todos los campos para procesar tu solicitud de manera rápida y segura.
            </p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            currentStep={mode === 'loan' ? currentStep - 9 : currentStep}
            steps={mode === 'loan' ? LOAN_STEPS : REGISTER_STEPS}
          />
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 border border-border" style={{ backgroundColor: "#F3F4F5" }}>
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
                title="Domicilio"
              />
            )}

            {currentStep === 6 && (
              <WorkInfoStep
                data={formData.guarantorWork}
                onChange={(data) => setFormData({ ...formData, guarantorWork: { ...formData.guarantorWork, ...data } })}
                title="Información Laboral del Aval"
              />
            )}

            {currentStep === 7 && (
              <GuarantorStep
                data={formData.guarantorReference}
                onChange={(data) => setFormData({ ...formData, guarantorReference: { ...formData.guarantorReference, ...data } })}
                existingCurps={existingCurps}
                title="Referencia del Cliente"
                isReference
              />
            )}

            {currentStep === 8 && (
              <WorkInfoStep
                data={formData.guarantorReferenceWork}
                onChange={(data) => setFormData({ ...formData, guarantorReferenceWork: { ...formData.guarantorReferenceWork, ...data } })}
                title="Información Laboral de la Referencia"
              />
            )}

            {currentStep === 9 && (
              <PromoterStep
                promoterData={formData.promoter}
                onPromoterChange={(data) => setFormData({ ...formData, promoter: { ...formData.promoter, ...data } })}
              />
            )}

            {currentStep === 10 && (
              <LoanDetailsStep
                data={formData.loanDetails}
                onChange={(data) => setFormData({ ...formData, loanDetails: { ...formData.loanDetails, ...data } })}
              />
            )}

            {currentStep === 11 && (
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
              disabled={currentStep === 0 || (mode === 'loan' && currentStep === 9)}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {/* Logic for Register Mode: Finish at Promoter Step (Step 9 in new order) */}
            {mode === 'register' && currentStep === 9 ? (
              <Button
                onClick={handleRegisterSubmit}
                className="gap-2 bg-gradient-primary"
              >
                <Send className="h-4 w-4" />
                Registrar Cliente
              </Button>
            ) : currentStep === STEPS.length - 1 ? (
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
      </div >
    </div >
  );
};

export default Index;