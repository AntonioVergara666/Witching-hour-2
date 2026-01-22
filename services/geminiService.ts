
import { GenerationParams } from "../types";

export const generateWitchImage = async (params: GenerationParams): Promise<string> => {
  // Tu API key de Fal.AI (consíguela en fal.ai)
  const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY || "347ac939-22c3-4f0c-83e0-17c70a33b604:8444930b2827b1e61caa682e99fa9cbc";
  
  const prompt = `A high-quality, cinematic digital painting of a ${params.archetype} witch. ${params.prompt}. 
  Ethereal lighting, intricate details, mystical atmosphere, dark fantasy aesthetic, 
  vibrant magical effects, professional artistic style, masterpiece, sharp focus, 
  intricate clothing, magical aura, fantasy art, highly detailed`;
  
  try {
    console.log("🔮 Iniciando generación con prompt:", prompt);
    
    const response = await fetch('https://fal.run/fal-ai/fast-sdxl/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: params.aspectRatio === 'LANDSCAPE' ? "landscape_16_9" : 
                   params.aspectRatio === 'PORTRAIT' ? "portrait_9_16" : "square_hd",
        negative_prompt: "blurry, bad quality, deformed, ugly, cartoon, 3d",
        num_images: 1,
        enable_safety_checker: false, // Para más libertad creativa
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error de API:", errorText);
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data?.images?.[0]?.url) {
      console.error("❌ No hay URL en la respuesta:", data);
      throw new Error("No se recibió una imagen válida");
    }
    
    console.log("✅ Imagen generada exitosamente:", data.images[0].url);
    return data.images[0].url;
    
  } catch (error: any) {
    console.error("🔥 Error completo:", error);
    
    // Manejo específico de errores
    if (error?.message?.includes("401") || error?.message?.includes("auth")) {
      throw new Error("🔐 **API Key incorrecta**\n\nNecesitas una clave válida de Fal.AI\nConsíguela en: https://fal.ai");
    }
    
    if (error?.message?.includes("429") || error?.message?.includes("quota")) {
      throw new Error("⏳ **Límite alcanzado**\n\nHas usado todo tu crédito gratuito.\nEspera o consigue más crédito en fal.ai");
    }
    
    throw new Error("¡El hechizo falló! 🌙\n\n" + (error.message || "Error desconocido"));
  }
};