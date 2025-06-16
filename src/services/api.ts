import axios from 'axios';

// API base URL ve key
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || '4b679ab8-8d82-47be-9145-c45b9105fae9';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Her istekte otomatik API key ekler
apiClient.interceptors.request.use(
  (config) => {
    // API key varsa header'a ekle
    if (API_KEY) {
      config.headers['X-API-KEY'] = API_KEY;
    }
    
    // Debug için log
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      hasApiKey: !!API_KEY,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Hata handling için
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Model listesi - Backend'den geliyor mu kontrol edelim
export const getModels = async () => {
  try {
    const response = await apiClient.get('/models');
    return response.data;
  } catch (error) {
    console.error('Model listesi alınamadı:', error);
    // Fallback model listesi
    return [
    //  { id: 'llama3.2:1b', name: 'Llama 3.2 1B' },
    ];
  }
};

// QnA sorusu gönder - GERÇEK FORMAT
export const sendQnAQuestion = async (prompt: string, model: string) => {
  try {
    const response = await apiClient.post('/qchat-api/v1/ollama/qna', {
      model: model,
      stream: true,
      prompt: prompt
    });

    console.log('🟢 QnA Response:', {
      status: response.data.status,
      data: response.data.data,
      fullResponse: response.data
    });

    // Backend response format: { "status": true, "data": { "response": "cevap" } }
    if (response.data.status && response.data.data) {
      const result = {
        answer: response.data.data.response,
        model: response.data.data.model,
        timestamp: response.data.data.created_at || new Date().toISOString()
      };
      
      console.log('🟢 QnA Parsed Result:', result);
      return result;
    } else {
      console.error('❌ QnA Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('❌ QnA Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};

// Chat mesajı gönder - GERÇEK FORMAT
export const sendChatMessage = async (messages: any[], model: string) => {
  try {
    const response = await apiClient.post('/qchat-api/v1/ollama/chat', {
      model: model,
      stream: true,
      messages: messages  // MainApp'ten gelen messages'ı direkt kullan
    });

    // Backend response format: { "status": true, "data": { "message": { "role": "assistant", "content": "cevap" } } }
    if (response.data.status && response.data.data && response.data.data.message) {
      return {
        message: response.data.data.message.content,
        model: response.data.data.model,
        timestamp: response.data.data.created_at || new Date().toISOString()
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Chat mesajı gönderilemedi:', error);
    throw error;
  }
};

// Token eklemek için interceptor (Microsoft Auth için)
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Token kaldır
export const removeAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

// Mevcut modelleri getir
export const getAvailableModels = async () => {
  const response = await apiClient.get('/qchat-api/v1/ollama/models');
  return response.data;
};

// API health check
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/qchat-api/v1/health', {
      timeout: 5000  // 5 saniye timeout
    });
    
    console.log('🔍 Health check response:', response.data);
    
    // Backend response kontrolü
    const isHealthy = response.data && response.data.status === true;
    console.log('🔍 API Health Status:', isHealthy);
    
    return isHealthy;
  } catch (error: any) {
    console.error('❌ API health check failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code
    });
    return false;
  }
};

// Stream uyumlu chat mesajı gönderme
export async function sendChatMessageStream(
  messages: any[],
  model: string,
  onChunk: (data: any) => void
) {
  const response = await fetch(`${API_BASE_URL}/qchat-api/v1/ollama/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages,
    }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let lines = buffer.split('\n');
    buffer = lines.pop()!;

    for (const line of lines) {
      if (line.trim()) {
        try {
          const json = JSON.parse(line);
          onChunk(json);
        } catch (e) {
          // parse hatası olursa atla
        }
      }
    }
  }
  if (buffer.trim()) {
    try {
      const json = JSON.parse(buffer);
      onChunk(json);
    } catch (e) {}
  }
}

// Stream uyumlu QnA fonksiyonu
export async function sendQnAQuestionStream(
  prompt: string,
  model: string,
  onChunk: (data: any) => void
) {
  const response = await fetch(`${API_BASE_URL}/qchat-api/v1/ollama/qna`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    body: JSON.stringify({
      model,
      stream: true,
      prompt,
    }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let lines = buffer.split('\n');
    buffer = lines.pop()!;

    for (const line of lines) {
      if (line.trim()) {
        try {
          const json = JSON.parse(line);
          onChunk(json);
        } catch (e) {
          // parse hatası olursa atla
        }
      }
    }
  }
  if (buffer.trim()) {
    try {
      const json = JSON.parse(buffer);
      onChunk(json);
    } catch (e) {}
  }
}

// OpenAI API entegrasyonu (Kendi Backend üzerinden)
// Stream uyumlu OpenAI mesajı gönderme - Backend proxy kullanıyor
export async function sendOpenAIMessageStream(
  messages: any[],
  model: string,
  onChunk: (data: any) => void
) {
  console.log('🚀 OpenAI Stream Request:', {
    url: `${API_BASE_URL}/qchat-api/v1/openai/chat`,
    model,
    messages,
    messageCount: messages.length
  });

  const response = await fetch(`${API_BASE_URL}/qchat-api/v1/openai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  console.log('🔍 OpenAI Response Status:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenAI API Error Response:', errorText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let chunkCount = 0;

  console.log('📡 Starting to read OpenAI stream...');

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log('✅ OpenAI Stream completed, total chunks:', chunkCount);
      break;
    }
    
    buffer += decoder.decode(value, { stream: true });
    console.log('📦 Raw chunk received:', buffer.slice(-100)); // Son 100 karakter

    let lines = buffer.split('\n');
    buffer = lines.pop()!;

    for (const line of lines) {
      if (line.trim()) {
        chunkCount++;
        console.log(`🔍 Processing line ${chunkCount}:`, line);
        try {
          const json = JSON.parse(line);
          console.log('✅ Parsed JSON:', json);
          onChunk(json);
        } catch (e) {
          console.warn('⚠️ JSON parse failed for line:', line, 'Error:', e);
        }
      }
    }
  }
  
  if (buffer.trim()) {
    console.log('🔍 Final buffer:', buffer);
    try {
      const json = JSON.parse(buffer);
      console.log('✅ Final JSON:', json);
      onChunk(json);
    } catch (e) {
      console.warn('⚠️ Final buffer parse failed:', buffer, 'Error:', e);
    }
  }
}

// Non-stream OpenAI chat mesajı (fallback için)
export const sendOpenAIMessage = async (messages: any[], model: string) => {
  try {
    const response = await apiClient.post('/qchat-api/v1/openai/chat', {
      model: model,
      messages: messages
    });

    console.log('🟢 OpenAI Response:', {
      status: response.data.status,
      data: response.data.data,
      fullResponse: response.data
    });

    // Backend response format kontrolü
    if (response.data.status && response.data.data) {
      return {
        message: response.data.data.content || response.data.data.message,
        model: response.data.data.model || model,
        timestamp: response.data.data.created_at || new Date().toISOString()
      };
    } else {
      console.error('❌ OpenAI Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('❌ OpenAI Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};

// ============ FILE MANAGEMENT API ============

// Dosya tipini tanımla
export interface FileDocument {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  uploadDate: string;
  path: string;
}

// Tüm dosyaları getir
export const getFiles = async (): Promise<FileDocument[]> => {
  try {
    const response = await apiClient.get('/qchat-api/v1/files');
    
    if (response.data.status && response.data.data && response.data.data.pdfs) {
      return response.data.data.pdfs;
    }
    return [];
  } catch (error) {
    console.error('Dosyalar alınamadı:', error);
    throw error;
  }
};

// Dosya sil
export const deleteFile = async (fileId: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/qchat-api/v1/files/${fileId}`);
    return response.data.status === true;
  } catch (error) {
    console.error('Dosya silinemedi:', error);
    throw error;
  }
}; 