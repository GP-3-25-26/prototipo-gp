import { useState, useEffect } from 'react';
import { Upload, FileText, Activity, CheckCircle, AlertCircle, ArrowRight, Save } from 'lucide-react';
import { MOCK_PATIENTS, MOCK_VARIANTS, MOCK_PREDICTION } from './data';
import { Button, Card } from './components/UI';
import { AIChat } from './components/AIChat';

function App() {
  const [step, setStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [feedback, setFeedback] = useState("");

  // --- LÓGICA DE PANTALLAS ---

  // PANTALLA 1: Carga y Selección [cite: 231]
  const ScreenUpload = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">1. Configuración del Análisis</h2>
      <Card>
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Paciente (Historial Clínico)</label>
        <select
          className="w-full border p-2 rounded-md mb-4"
          onChange={(e) => setSelectedPatient(MOCK_PATIENTS.find(p => p.id === Number(e.target.value)))}
        >
          <option value="">-- Seleccione un paciente --</option>
          {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.historyId})</option>)}
        </select>

        {selectedPatient && (
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 mb-6">
            <strong>Info:</strong> {selectedPatient.familyHistory}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">Arrastra aquí el fichero .FASTQ</p>
          <p className="text-xs text-gray-400 mt-1">o haz clic para explorar</p>
        </div>
      </Card>
      <div className="flex justify-end">
        <Button disabled={!selectedPatient} onClick={() => setStep(2)}>
          Procesar Archivo <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );

  // PANTALLA 2: Procesamiento (Simulación) [cite: 232]
  const ScreenProcessing = () => {
    useEffect(() => {
      const timer = setInterval(() => {
        setProcessingProgress(old => {
          if (old === 100) {
            clearInterval(timer);
            return 100;
          }
          return Math.min(old + 2, 100);
        });
      }, 50); // Simula 2.5 segundos de carga
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="max-w-xl mx-auto text-center mt-20">
        <Activity className="h-16 w-16 text-blue-600 mx-auto animate-pulse mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analizando Secuencias Genómicas</h2>
        <p className="text-gray-500 mb-8">Comparando con genoma de referencia (GRCh38)...</p>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: `${processingProgress}%` }}></div>
        </div>
        <p className="text-sm font-mono text-gray-600">{processingProgress}% Completado</p>

        {processingProgress === 100 && (
          <div className="mt-8 animate-fade-in">
            <Button onClick={() => setStep(3)} variant="success">Análisis Completado - Ver Variantes</Button>
          </div>
        )}
      </div>
    );
  };

  // PANTALLA 3: Listado de Variantes + Chat [cite: 233, 234]
  const ScreenVariants = () => (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      <div className="col-span-2 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Variantes Detectadas</h2>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">4 Variantes de interés</span>
        </div>

        {MOCK_VARIANTS.map((v) => (
          <Card key={v.id} className="flex justify-between items-center p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-blue-900">{v.gene}</span>
                <span className="text-sm text-gray-500 font-mono">{v.variant}</span>
              </div>
              <div className="mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${v.classification.includes('Patogénica') ? 'bg-red-100 text-red-700 font-bold' : 'bg-green-100 text-green-700'}`}>
                  {v.classification}
                </span>
                <span className="text-xs text-gray-400 ml-2">Profundidad: {v.depth}</span>
              </div>
            </div>
            <Button variant="secondary" onClick={() => { }}>Ver en ClinVar</Button>
          </Card>
        ))}

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Siguiente paso: Predicción IA</h3>
          <p className="text-sm text-blue-700 mb-4">
            El modelo utilizará estas variantes filtradas junto con el historial de "{selectedPatient?.familyHistory}" para predecir patologías.
          </p>
          <Button onClick={() => setStep(4)}>Ejecutar Predicción de Enfermedades</Button>
        </div>
      </div>

      <div className="col-span-1 h-full">
        <AIChat context="Listado de variantes detectadas (RHO, USH2A...)" />
      </div>
    </div>
  );

  // PANTALLA 4: Predicción + Explicabilidad [cite: 235, 236]
  const ScreenPrediction = () => (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      <div className="col-span-2 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-blue-600" /> Resultado de la Predicción
        </h2>

        <Card className="border-l-8 border-l-blue-600 bg-gradient-to-r from-white to-blue-50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Enfermedad más probable</p>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">{MOCK_PREDICTION.disease}</h1>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-blue-600">{MOCK_PREDICTION.probability}%</span>
              <p className="text-xs text-gray-500">Confianza del modelo</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText size={18} /> Explicabilidad (XAI) [cite: 235]
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            {MOCK_PREDICTION.reasoning}
          </p>
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Pruebas recomendadas:</h4>
            <div className="flex gap-2">
              {MOCK_PREDICTION.recommendedTests.map(test => (
                <span key={test} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border">
                  {test}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={() => setStep(5)}>Validar Diagnóstico</Button>
        </div>
      </div>

      <div className="col-span-1 h-full">
        <AIChat context={`Predicción: ${MOCK_PREDICTION.disease}. Probabilidad: ${MOCK_PREDICTION.probability}%`} />
      </div>
    </div>
  );

  // PANTALLA 5: Feedback y Cierre [cite: 237]
  const ScreenFeedback = () => (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="text-center py-10">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Proceso Finalizado</h2>
        <p className="text-gray-500 mb-8">Por favor, valida la predicción del sistema para mejorar el modelo.</p>

        <div className="text-left max-w-md mx-auto mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios del Genetista</label>
          <textarea
            className="w-full border rounded-md p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Añade tus observaciones clínicas aquí..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => alert("Feedback registrado: Predicción rechazada")}>Rechazar Predicción</Button>
          <Button onClick={() => alert("¡Proceso guardado correctamente! Feedback enviado.")}>
            <Save size={16} /> Confirmar y Guardar
          </Button>
        </div>
      </Card>

      <div className="text-center mt-8">
        <button onClick={() => { setStep(1); setProcessingProgress(0); setFeedback(""); }} className="text-blue-600 underline text-sm">
          Iniciar nuevo análisis
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-800">G7 GeneticDiag <span className="text-xs text-gray-400 font-normal">PROTOTYPE</span></span>
          </div>
          <div className="flex items-center gap-4">
            {/* STEPPER VISUAL */}
            <div className="flex items-center text-sm">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`flex items-center ${step === s ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border mr-1 ${step === s ? 'bg-blue-100 border-blue-600' : 'border-gray-300'}`}>
                    {s}
                  </span>
                  {s < 5 && <div className="w-8 h-[1px] bg-gray-300 mx-2"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className=" w-screen mx-auto px-4 py-8">
        {step === 1 && <ScreenUpload />}
        {step === 2 && <ScreenProcessing />}
        {step === 3 && <ScreenVariants />}
        {step === 4 && <ScreenPrediction />}
        {step === 5 && <ScreenFeedback />}
      </main>
    </div>
  );
}

export default App;