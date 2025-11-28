
export interface GeneratedSong {
  title: string;
  stylePrompt: string; // The final string to paste into Suno
  lyrics: string;      // Lyrics with tags
  explanation: string;
  styleDescription?: string; // Long paragraph description
  promptTechnique?: string; // e.g., "JSON Structure" or "Standard"
}

export interface StructureBlock {
  id: string;
  type: 'Intro' | 'Verse' | 'Pre-Chorus' | 'Chorus' | 'Bridge' | 'Outro' | 'Instrumental' | 'Custom';
  style: string; // Technical tags (e.g. "Guzheng Solo", "Heavy Bass")
  instruments?: string; // Specific instruments (e.g. "Piano, Drums")
  description?: string; // Narrative (e.g. "A soulful male voice telling a story")
  lyrics: string;
  duration: number; // Duration in seconds
}

export interface SongRequest {
  mode: 'inspiration' | 'arrangement';
  modelVersion: 'v4' | 'v5';
  
  // Inspiration Mode fields
  topic?: string;
  mood?: string;
  genre?: string;
  customInstructions?: string;
  instrumental?: boolean;
  
  // Arrangement Mode fields
  originalLyrics?: string;
  structureBlocks?: StructureBlock[]; // For Visual Builder
  targetDuration?: number; // In minutes, e.g. 3.5
  useStructureBuilder?: boolean;
  bpm?: number; // Beats Per Minute
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
