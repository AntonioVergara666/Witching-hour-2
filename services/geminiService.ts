import Replicate from "replicate";
import { GenerationParams } from "../types";

// Inicializa Replicate con tu API key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || process.env.API_KEY, // Usa cualquiera de los dos nombres
});

export const generateWitchImage = async (params: GenerationParams): Promise<string> => {
  // Prompt mejorado para brujas/fantasía oscura
  const prompt = `A high-quality, cinematic digital painting of a ${params.archetype} witch. ${params.prompt}. 
  Ethereal lighting, intricate details, mystical atmosphere, dark fantasy aesthetic, 
  vibrant magical effects, professional artistic style, masterpiece, sharp focus, 
  intricate clothing, magical aura, fantasy art, highly detailed, trending on ArtStation`;
  
  const negativePrompt = "blurry, bad quality, deformed, ugly, bad anatomy, extra limbs, poorly drawn, watermark, signature, text, cartoon, 3d, realistic";
  
  // Configuración de tamaño según aspect ratio
  let width = 768;
  let height = 768;
  
  if (params.aspectRatio === 'LANDSCAPE') {
    width = 1024;
    height = 768;
  } else if (params.aspectRatio === 'PORTRAIT') {
    width = 768;
    height = 1024;
  }
  
  try {
    // Modelo: Stable Diffusion XL - excelente para fantasía
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          negative_prompt: negativePrompt,
          width: width,
          height: height,
          num_outputs: 1,
          num_inference_steps: 30, // Más pasos = mejor calidad
          guidance_scale: 7.5, // Creatividad vs. seguir prompt
          scheduler: "DPMSolverMultistep",
        }
      }
    ) as string[];
    
    // output es un array: ["https://replicate.delivery/.../output.png"]
    if (!output || !output[0]) {
      throw new Error("El aquelarre no produjo ninguna imagen.");
    }
    
    return output[0]; // Devuelve la URL de la imagen
    
  } catch (error: any) {
    console.error("Error en la conjuración:", error);
    
    // Manejo de errores en español
    if (error?.status === 401 || error?.message?.includes("auth") || error?.message?.includes("API key")) {
      throw new Error("🔐 **API Key inválida**\n\nRevisa tu clave de Replicate en las variables de entorno.");
    }
    
    if (error?.status === 429) {
      throw new Error("⏳ **Demasiadas invocaciones**\n\nEl caldero mágico necesita enfriarse. Espera 30 segundos.");
    }
    
    if (error?.message?.includes("NSFW") || error?.message?.includes("content policy")) {
      throw new Error("🚫 **Contenido no permitido**\n\nEl hechizo contiene elementos que el grimorio prohibe. Intenta con otro prompt.");
    }
    
    // Error general
    throw new Error("¡El hechizo falló! 🌙\n\nLos espíritus de Stable Diffusion no responden. Intenta nuevamente.");
  }
};

// Función opcional para convertir URL a base64 (si tu frontend lo necesita)
export const urlToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Error descargando imagen");
    
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error convirtiendo imagen:", error);
    throw new Error("No se pudo procesar la imagen mágica.");
  }
};