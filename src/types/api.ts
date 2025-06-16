// API istekleri ve yanıtları için tip tanımları

// Model listesi için
export interface Model {
  id: string;
  name: string;
  description?: string;
}

// QnA isteği için
export interface QnARequest {
  question: string;
  modelId: string;
}

// QnA yanıtı için
export interface QnAResponse {
  answer: string;
  model: string;
  timestamp: string;
}

// Chat mesajı için
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Chat isteği için
export interface ChatRequest {
  message: string;
  modelId: string;
  history: ChatMessage[];
}

// Chat yanıtı için
export interface ChatResponse {
  message: string;
  model: string;
  timestamp: string;
}

// API hata yanıtı için
export interface ApiError {
  message: string;
  status: number;
} 