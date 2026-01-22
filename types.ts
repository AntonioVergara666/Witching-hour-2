
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  model: string;
}

export enum WitchArchetype {
  MOON = "Moon Witch",
  SEA = "Sea Witch",
  FOREST = "Forest Witch",
  STORM = "Storm Witch",
  CYBER = "Cyber Witch",
  VINTAGE = "Vintage Occult",
  ELDRITCH = "Eldritch Priestess"
}

export interface GenerationParams {
  prompt: string;
  archetype: WitchArchetype;
  aspectRatio: "1:1" | "4:3" | "16:9" | "9:16";
}
