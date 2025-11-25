import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserPlus, CreditCard, FileText } from "lucide-react";

const Home = () => {
    const navigate = useNavigate();

    return (
        // Fondo fijo original: #D6D6D5
        <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center" style={{ backgroundColor: "#D6D6D5" }}>
            <div className="max-w-4xl w-full mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <FileText className="h-20 w-20 text-black/70" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-black/50 drop-shadow-lg">
                        Bienvenido
                    </h1>
                    <p className="text-black/50 text-xl md:text-2xl max-w-2xl mx-auto">
                        Selecciona una opción para continuar
                    </p>
                </div>

                {/* Menu Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <Button
                        onClick={() => navigate("/form?mode=register")}
                        className="h-40 text-xl flex flex-col gap-4 bg-white hover:bg-gray-50 text-black border-2 border-transparent hover:border-primary transition-all shadow-xl rounded-xl group"
                        variant="ghost"
                    >
                        <UserPlus className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Registrar Cliente</span>
                    </Button>

                    <Button
                        onClick={() => navigate("/form?mode=loan")}
                        className="h-40 text-xl flex flex-col gap-4 bg-white hover:bg-gray-50 text-black border-2 border-transparent hover:border-primary transition-all shadow-xl rounded-xl group"
                        variant="ghost"
                    >
                        <CreditCard className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Solicitar Préstamo</span>
                    </Button>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground pt-12">
                    <p>© 2025 Emprendedora. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;