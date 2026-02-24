import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "onepercent_token";
const API_BASE_URL = __DEV__
  ? "http://10.1.10.81:8000"
  : "https://your-deployed-api.com";

// Get the API base URL dynamically based on the current network
// This works with phone hotspots by detecting the correct IP from Expo Constants
// function getApiBaseUrl(): string {
//   if (!__DEV__) {
//     return "https://your-deployed-api.com";
//   }

//   // Method 1: Try to get from expoConfig hostUri (most reliable)
//   const hostUri = Constants.expoConfig?.hostUri;
//   if (hostUri) {
//     const ip = hostUri.split(":")[0];
//     return `http://${ip}:8000`;
//   }

//   // Method 2: Try to get from manifest debuggerHost
//   const manifest = Constants.manifest2 || Constants.manifest;
//   const debuggerHost =
//     manifest?.debuggerHost || manifest?.extra?.expoGo?.debuggerHost;
//   if (debuggerHost) {
//     const ip = debuggerHost.split(":")[0];
//     return `http://${ip}:8000`;
//   }

//   // Method 3: Try to get from expoConfig extra
//   const extraDebuggerHost = Constants.expoConfig?.extra?.debuggerHost;
//   if (extraDebuggerHost) {
//     const ip = extraDebuggerHost.split(":")[0];
//     return `http://${ip}:8000`;
//   }

//   // Last resort: use localhost (won't work with physical device)
//   // In this case, you may need to manually set the IP
//   console.warn(
//     "Could not detect IP address automatically. API calls may fail."
//   );
//   return "http://localhost:8000";
// }

// const API_BASE_URL = getApiBaseUrl();

// // Log the API URL in development for debugging
// if (__DEV__) {
//   console.log("API Base URL:", API_BASE_URL);
// }

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// #################### MESSAGE INTERFACES #######################################

export interface MessagePayload {
  title?: string | null;
  content?: string;
  message_type?: "text" | "voice";
  focus_area?: string | null;
}

export interface MessageResponse extends MessagePayload {
  id: number;
  user_id: number;
  created_at: string;
  updated_at?: string | null;
  voice_file_path?: string | null;
}

export interface VoiceMessagePayload {
  file:
    | File
    | Blob
    | { uri: string; type: string; name: string; duration: string };
  title?: string | null;
  focus_area?: string | null;
}

// #################### USER INTERFACES #######################################

export interface UserResponse {
  id: number;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface MessageStatsResponse {
  total_messages: number;
  text_messages: number;
  voice_messages: number;
}

// ###############################################################################
// ################################## APIs #######################################

// ################################## USER APIs #####################################

export async function registerUser(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  return apiRequest<AuthResponse>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    false,
  );
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  const body = new URLSearchParams();
  body.append("username", payload.email);
  body.append("password", payload.password);

  return apiRequest<AuthResponse>(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    },
    false,
  );
}

export async function getCurrentUser(): Promise<ApiResponse<UserResponse>> {
  return apiRequest<UserResponse>("/api/auth/me");
}

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error reading token from storage", error);
      return null;
    }
  },
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token to storage", error);
    }
  },
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token from storage", error);
    }
  },
};

const REQUEST_TIMEOUT = 10000; // 10 seconds

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true,
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = new Headers(options.headers as HeadersInit);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (requiresAuth) {
      const token = await tokenStorage.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        clearTimeout(timeoutId);
        return {
          success: false,
          error: "Not authenticated",
        };
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired/invalid
      if (response.status === 401 && requiresAuth) {
        await tokenStorage.removeToken();
      }
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      return {
        success: false,
        error: errorData.detail || "An error occurred",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Request timeout: Server took too long to respond",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error: Could not connect to server",
    };
  }
}

// ################################## MESSAGE APIs #####################################

// List messages
export async function getMessages(): Promise<ApiResponse<MessageResponse[]>> {
  return apiRequest<MessageResponse[]>("/api/messages");
}

// Create message
export async function createMessage(
  payload: MessagePayload,
): Promise<ApiResponse<MessageResponse>> {
  return apiRequest<MessageResponse>("/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Update message
export async function updateMessage(
  id: number,
  payload: Partial<MessagePayload>,
): Promise<ApiResponse<MessageResponse>> {
  return apiRequest<MessageResponse>(`/api/messages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Delete message
export async function deleteMessage(id: number): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/messages/${id}`, {
    method: "DELETE",
  });
}

// Upload voice message
export async function uploadVoiceMessage(
  voiceMessagePayload: VoiceMessagePayload,
): Promise<ApiResponse<MessageResponse>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT * 3); // Longer timeout for file uploads (30s)

  try {
    const formData = new FormData();
    formData.append("file", voiceMessagePayload.file as any);
    if (voiceMessagePayload.title != null && voiceMessagePayload.title !== "") {
      formData.append("title", voiceMessagePayload.title);
    }
    if (voiceMessagePayload.focus_area) {
      formData.append("focus_area", voiceMessagePayload.focus_area);
    }

    const token = await tokenStorage.getToken();
    if (!token) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const url = `${API_BASE_URL}/api/messages/upload-voice`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        await tokenStorage.removeToken();
      }
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      return {
        success: false,
        error: errorData.detail || "Upload failed",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Upload timeout: Server took too long to respond",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error: Could not upload file",
    };
  }
}

export async function getMessageStats(): Promise<
  ApiResponse<MessageStatsResponse>
> {
  return apiRequest<MessageStatsResponse>("/api/messages/stats");
}
