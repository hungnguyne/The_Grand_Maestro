export enum ApiProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  OPENROUTER = 'openrouter',
  LOCAL = 'local',
}

export interface ApiConfig {
  id: string;
  name: string;
  provider: ApiProvider;
  apiKey: string;
  model: string;
  isActive: boolean;
  baseUrl?: string;
}

export interface UserInput {
  existingEquipment: string;
  musicTaste: string;
  source: string;
  roomSize: string;
  roomMaterial: string;
  budget: string;
  language: string;
}

export interface SpeakerInput {
  speakerTaste: string;
  roomSize: string;
  roomHeight: string;
  roomAcoustics: string;
  ampType: string;
  sourceType: string;
  volumeHabit: string;
  aesthetic: string;
  expectation: string;
  budget: string;
  language: string;
}
