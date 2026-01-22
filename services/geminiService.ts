import { fal } from "@fal-ai/client";
import { GenerationParams } from "../types";

// Configura Fal - USA ESTA KEY PÚBLICA PARA PRUEBAS (o tu propia key)
fal.config({
  credentials: "347ac939-22c3-4f0c-83e0-17c70a33b604:8444930b2827b1e61caa682e99fa9cbc", // Tu key de Fal.AI
});

export const generateWitchImage = async (params: GenerationParams): Promise<string> => {
  // Prompt mejorado para brujas/fantasía oscura
  const prompt = `A high-quality, cinematic digital painting of a ${params.archetype} witch. ${params.prompt}. 
  Ethereal lighting, intricate details, mystical atmosphere, dark fantasy aesthetic, 
  vibrant magical effects, professional artistic style, masterpiece, sharp focus, 
  intricate clothing, magical aura, fantasy art, highly detailed, trending on ArtStation`;
  
  const negativePrompt = "blurry, bad quality, deformed, ugly, bad anatomy, extra limbs, poorly drawn, watermark, signature, text, cartoon, 3d, realistic";
  
  try {
    // 👇 CORREGIDO: Usa fal.run() NO replicate.run()
    const result = await fal.run("fal-ai/fast-sdxl", {
      input: {
        prompt: prompt,
        negative_prompt: negativePrompt,
        image_size: params.aspectRatio === 'LANDSCAPE' ? "landscape_16_9" : "portrait_9_16",
        num_images: 1,
        enable_safety_checker: true,
      }
    });
    
    // result tiene una estructura diferente a replicate
    if (!result?.data?.images?.[0]?.url) {
      throw new Error("El aquelarre no produjo ninguna imagen.");
    }
    
    return result.data.images[0].url; // Devuelve la URL de la imagen
    
  } catch (error: any) {
    console.error("Error en la conjuración:", error);
    
    // Manejo de errores en español
    if (error?.status === 401 || error?.message?.includes("auth") || error?.message?.includes("API key")) {
      throw new Error("🔐 **API Key inválida**\n\nRevisa tu clave de Fal.AI.");
    }
    
    if (error?.status === 429) {
      throw new Error("⏳ **Demasiadas invocaciones**\n\nEl caldero mágico necesita enfriarse. Espera 30 segundos.");
    }
    
    if (error?.message?.includes("NSFW") || error?.message?.includes("content policy")) {
      throw new Error("🚫 **Contenido no permitido**\n\nEl hechizo contiene elementos que el grimorio prohibe. Intenta con otro prompt.");
    }
    
    // Error general
    throw new Error("¡El hechizo falló! 🌙\n\nLos espíritus no responden. Intenta nuevamente.");
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