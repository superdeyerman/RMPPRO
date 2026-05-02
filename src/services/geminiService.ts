import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres el Asesor de Imagen Profesional y Sistema Inteligente Central de Reverencia Majestad, una marca premium de belleza y transformación capilar.

## TU PERSONA
Eres un experto en visagismo, colorimetría, estilismo y moda de alta gama. Tu conocimiento es enciclopédico en cuanto a tendencias, técnicas de transformación capilar y armonía estética. Hablas con la autoridad de un experto pero con la calidez de un confidente de lujo.

## VISIÓN DEL ECOSISTEMA
Operas como el cerebro digital de un sistema con 7 núcleos: CRM, Agenda, Domicilio, Panel Dueño, Panel Estilista, Tienda Online y Asistente IA.

## IDENTIDAD Y TONO
- Tono: Elegante, sofisticado, profesional, cálido, claro y altamente personalizado.
- Representas: Lujo, transformación, cuidado profesional y la excelencia de la "Majestad".

## REGLAS DE NEGOCIO CRÍTICAS
1. Solo atención con reserva ($5.000 CLP).
2. Precio depende de Largo (Corto, Medio, Largo, Extra Largo) y Abundancia (Poco, Normal, Abundante).
3. Domicilio: Recargo según costo Uber desde Rosas 1884.
4. Calendario Lunar: Referencia tradicional para cortes/tratamientos.

## TAREAS POR ROL
- Cliente: Diagnóstico de imagen, colorimetría, asesoría de estilo, cotización, agenda, tienda.
- Empleado/Estilista: Protocolos técnicos, revisión de citas, guías de estilo.
- Dueño/Admin: Métricas estratégicas, gestión de leads y equipo.

## GUÍA DE ASESORÍA
Cuando realices asesorías (especialmente con fotos):
- Analiza la morfología facial para recomendar cortes y peinados.
- Usa la teoría de las 4 estaciones para colorimetría.
- Evalúa proporciones corporales para sugerencias de estilo y vestuario.
- Siempre busca la "mejor versión" de la clienta, elevando su confianza.

## SALIDA ESTRUCTURADA (JSON)
{
  "rol_detectado": "cliente | potencial | empleado | admin | dueño",
  "categoria": ["extensiones", "restauración", "alisado", "corte bordado", "agenda", "tienda", "crm", "admin"],
  "necesidad_principal": "string",
  "nivel_intencion": "baja | media | alta | lista para reservar",
  "prioridad": "informativa | comercial | urgente | interna | administrativa",
  "datos_cotizacion": {
    "largo": "corto | medio | largo | extra largo | null",
    "abundancia": "poco | normal | abundante | null",
    "modalidad": "estudio | domicilio | null"
  },
  "servicio_recomendado": "string",
  "requiere_calendario_lunar": boolean,
  "fase_lunar_consultada": "string",
  "requiere_agenda": boolean,
  "accion_siguiente": "string",
  "mensaje_usuario": "string"
}
`;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface InteractionAnalysis {
  rol_detectado: string;
  categoria: string[];
  necesidad_principal: string;
  nivel_intencion: string;
  prioridad: string;
  datos_cotizacion?: {
    largo: string | null;
    abundancia: string | null;
    modalidad: string | null;
  };
  servicio_recomendado: string;
  requiere_calendario_lunar: boolean;
  fase_lunar_consultada: string;
  requiere_agenda: boolean;
  accion_siguiente: string;
  mensaje_usuario: string;
}

export const getGeminiResponse = async (history: ChatMessage[], currentRole: string = "cliente") => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    })),
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\n\nCONTEXTO ACTUAL: El usuario es un ${currentRole}.`,
      temperature: 0.7,
    },
  });

  return response.text || "Mis disculpas, he tenido una pequeña interrupción técnica. ¿Podría repetirme su consulta?";
};

export const analyzeInteraction = async (history: ChatMessage[]): Promise<InteractionAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Analiza la conversación y genera el JSON de protocolo: ${JSON.stringify(history)}` }]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rol_detectado: { type: Type.STRING },
          categoria: { type: Type.ARRAY, items: { type: Type.STRING } },
          necesidad_principal: { type: Type.STRING },
          nivel_intencion: { type: Type.STRING },
          prioridad: { type: Type.STRING },
          datos_cotizacion: {
            type: Type.OBJECT,
            properties: {
              largo: { type: Type.STRING, nullable: true },
              abundancia: { type: Type.STRING, nullable: true },
              modalidad: { type: Type.STRING, nullable: true }
            }
          },
          servicio_recomendado: { type: Type.STRING },
          requiere_calendario_lunar: { type: Type.BOOLEAN },
          fase_lunar_consultada: { type: Type.STRING },
          requiere_agenda: { type: Type.BOOLEAN },
          accion_siguiente: { type: Type.STRING },
          mensaje_usuario: { type: Type.STRING }
        },
        required: ["rol_detectado", "categoria", "necesidad_principal", "nivel_intencion", "prioridad", "accion_siguiente", "mensaje_usuario"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Error parsing analysis:", e);
    return {
      rol_detectado: "cliente",
      categoria: ["asesoría"],
      necesidad_principal: "desconocida",
      nivel_intencion: "baja",
      prioridad: "informativa",
      servicio_recomendado: "",
      requiere_calendario_lunar: false,
      fase_lunar_consultada: "",
      requiere_agenda: false,
      accion_siguiente: "continuar",
      mensaje_usuario: ""
    };
  }
};

export const getAdvisoryResponse = async (
  images: { data: string; mimeType: string }[],
  metadata: { height: string; sizes: string; additionalInfo: string }
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const imageParts = images.map(img => ({
    inlineData: {
      data: img.data.split(',')[1], // Remove data:image/png;base64,
      mimeType: img.mimeType
    }
  }));

  const prompt = `
    Realiza una ASESORÍA DE IMAGEN INTEGRAL Y GRATUITA para esta clienta de Reverencia Majestad.
    
    DATOS PROPORCIONADOS:
    - Estatura: ${metadata.height}
    - Tallas/Cuerpo: ${metadata.sizes}
    - Información adicional: ${metadata.additionalInfo}
    
    INSTRUCCIONES DE ANÁLISIS:
    1. Analiza las fotos de rostro (frente, perfiles) para determinar la forma del rostro y recomendar PEINADOS y CORTES.
    2. Analiza el tono de piel y ojos para recomendar una PALETA DE COLORES (Colorimetría) y TONOS de cabello.
    3. Analiza la foto de cuerpo completo y estatura para evaluar el ESTILO que mejor le favorece.
    4. Proporciona una experiencia de LUJO, única y personalizada.
    
    Responde con un tono elegante, profesional y cálido. Estructura tu respuesta con secciones claras.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          ...imageParts,
          { text: prompt }
        ]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
    },
  });

  return response.text || "No he podido generar la asesoría en este momento. Por favor, intente nuevamente.";
};
