import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  TrendingUp,
  Trash2,
  Bot,
  User,
  Loader2
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from '../context/AuthContext';
import { db, addDoc, collection } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface InteractionAnalysis {
  tipo_servicio: string;
  prioridad: 'alta' | 'media' | 'baja';
  resumen: string;
  requiere_calendario_lunar: boolean;
  fase_lunar_consultada?: string;
}

const ChatView = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bienvenida a Reverencia Majestad. Soy el Sistema Inteligente Central. ¿En qué puedo asistirle hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InteractionAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeConversation = async (history: ChatMessage[]) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analiza esta conversación de peluquería de lujo y extrae datos en JSON: ${JSON.stringify(history)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tipo_servicio: { type: Type.STRING },
              prioridad: { type: Type.STRING, enum: ["alta", "media", "baja"] },
              resumen: { type: Type.STRING },
              requiere_calendario_lunar: { type: Type.BOOLEAN },
              fase_lunar_consultada: { type: Type.STRING }
            },
            required: ["tipo_servicio", "prioridad", "resumen", "requiere_calendario_lunar"]
          }
        }
      });

      const result = await model;
      if (result.text) {
        const data = JSON.parse(result.text || '{}');
        setAnalysis(data);
        setShowAnalysis(true);

        // Save to Firestore if user is logged in
        if (user) {
          await addDoc(collection(db, 'asesorias'), {
            ...data,
            userId: user.uid,
            userEmail: user.email,
            createdAt: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.error("Error parsing analysis", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "Eres el asistente de lujo de Reverencia Majestad. Eres elegante, servicial y experto en restauración capilar y extensiones premium. Responde con sofisticación."
        }
      });

      setMessages([...newMessages, { role: 'model', text: response.text || '' }]);
      
      if (newMessages.length > 2) {
        analyzeConversation([...newMessages, { role: 'model', text: response.text || '' }]);
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages([...newMessages, { role: 'model', text: "Mis disculpas, majestad. He tenido un inconveniente técnico. ¿Podría repetir su consulta?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'model', text: 'Bienvenida a Reverencia Majestad. Soy el Sistema Inteligente Central. ¿En qué puedo asistirle hoy?' }
    ]);
    setAnalysis(null);
    setShowAnalysis(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f5f2ed] p-4 md:p-8 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8 h-full">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-[3rem] shadow-2xl border border-border overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a059] flex items-center justify-center text-white shadow-lg shadow-[#c5a059]/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif tracking-widest uppercase">Asesoría Majestad</h2>
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray">Inteligencia Artificial Premium</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={clearChat}
                className="p-3 rounded-full hover:bg-red-50 text-char\/20 hover:text-red-500 transition-all"
                title="Limpiar conversación"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] uppercase tracking-widest font-bold text-gray">Sistema Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#1a1a1a] text-white rounded-tr-none' 
                    : 'bg-[#f5f2ed] text-charcoal rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#f5f2ed] p-6 rounded-[2rem] rounded-tl-none flex gap-2">
                  <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-8 bg-white/50 backdrop-blur-md border-t border-border">
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta de belleza..."
                className="flex-1 bg-[#f5f2ed] border-none rounded-full px-8 py-5 text-sm focus:ring-2 focus:ring-[#c5a059]/20 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                className="w-14 h-14 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center hover:bg-[#c5a059] transition-all shadow-xl active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Sidebar */}
        <AnimatePresence>
          {showAnalysis && analysis && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full md:w-80 space-y-6"
            >
              <div className="bg-white p-8 rounded-[3rem] border border-border shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="text-[#c5a059] w-5 h-5" />
                  <h3 className="text-sm font-serif uppercase tracking-widest">Diagnóstico</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-gray mb-2">Servicio Detectado</p>
                    <p className="text-sm font-medium text-[#c5a059]">{analysis.tipo_servicio}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-gray mb-2">Prioridad</p>
                    <span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold ${
                      analysis.prioridad === 'alta' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {analysis.prioridad}
                    </span>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-gray mb-2">Resumen Ejecutivo</p>
                    <p className="text-xs text-gray leading-relaxed italic">"{analysis.resumen}"</p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <button className="w-full btn-premium text-[10px] py-4">Agendar Ahora</button>
                </div>
              </div>

              {analysis.requiere_calendario_lunar && (
                <section className="p-4 rounded-2xl border border-[#c5a059]/20 bg-[#c5a059]/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3 h-3 text-[#c5a059]" />
                    <p className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold">Calendario Lunar</p>
                  </div>
                  <p className="text-[11px] text-[#c5a059]/80 italic">
                    Fase recomendada: {analysis.fase_lunar_consultada}
                  </p>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatView;
