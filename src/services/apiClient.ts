/**
 * API Client for Ekatra-bot backend.
 * Handles bearer token authentication, request wrapping, base URL discovery,
 * and connection health reporting.
 */

export interface ConnectionStatus {
  state: "connected" | "connecting" | "unauthorized" | "disconnected" | "error";
  baseUrl: string;
  hasKey: boolean;
  message?: string;
  databaseOk?: boolean;
  workerLive?: boolean;
}

const STORAGE_KEY = "ek_api_key";
const STORAGE_BASE_URL = "ek_api_base_url";

// Default to Vite proxy (relative "") if on same host, or fallback to http://localhost:3000
const DEFAULT_BASE_URL = (import.meta as any).env?.VITE_API_BASE ?? "";

class ApiClient {
  private apiKey: string | null = null;
  private baseUrl: string = DEFAULT_BASE_URL;
  private listeners: Set<(status: ConnectionStatus) => void> = new Set();
  private lastStatus: ConnectionStatus = {
    state: "connecting",
    baseUrl: DEFAULT_BASE_URL,
    hasKey: false,
  };

  constructor() {
    if (typeof window !== "undefined") {
      this.apiKey =
        window.sessionStorage.getItem(STORAGE_KEY) ||
        window.localStorage.getItem(STORAGE_KEY) ||
        (import.meta as any).env?.VITE_ADMIN_API_KEY ||
        null;

      const storedUrl = window.localStorage.getItem(STORAGE_BASE_URL);
      if (storedUrl) {
        this.baseUrl = storedUrl;
      }
    }
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  setApiKey(key: string, persist = true): void {
    this.apiKey = key.trim();
    if (typeof window !== "undefined") {
      if (persist) {
        window.localStorage.setItem(STORAGE_KEY, this.apiKey);
      } else {
        window.sessionStorage.setItem(STORAGE_KEY, this.apiKey);
      }
    }
    void this.checkConnection();
  }

  clearApiKey(): void {
    this.apiKey = null;
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(STORAGE_KEY);
    }
    this.updateStatus({
      state: "unauthorized",
      baseUrl: this.baseUrl,
      hasKey: false,
      message: "API Key required",
    });
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/+$/, "");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_BASE_URL, this.baseUrl);
    }
    void this.checkConnection();
  }

  onStatusChange(cb: (status: ConnectionStatus) => void): () => void {
    this.listeners.add(cb);
    cb(this.lastStatus);
    return () => this.listeners.delete(cb);
  }

  private updateStatus(status: ConnectionStatus): void {
    this.lastStatus = status;
    this.listeners.forEach((cb) => {
      try {
        cb(status);
      } catch (e) {
        console.error("Error in status listener", e);
      }
    });
  }

  async checkConnection(): Promise<ConnectionStatus> {
    try {
      // 1. Check basic health
      const healthRes = await fetch(`${this.baseUrl}/health`).catch(() => null);
      if (!healthRes || !healthRes.ok) {
        const status: ConnectionStatus = {
          state: "disconnected",
          baseUrl: this.baseUrl,
          hasKey: !!this.apiKey,
          message: "Cannot reach backend server at " + (this.baseUrl || "localhost:3000"),
        };
        this.updateStatus(status);
        return status;
      }

      // 2. Check ready status
      const readyRes = await fetch(`${this.baseUrl}/ready`).catch(() => null);
      const readyData = readyRes && readyRes.ok ? await readyRes.json().catch(() => null) : null;
      const workerRes = await fetch(`${this.baseUrl}/worker-status`).catch(() => null);
      const workerData = workerRes && workerRes.ok ? await workerRes.json().catch(() => null) : null;

      if (!this.apiKey) {
        const status: ConnectionStatus = {
          state: "unauthorized",
          baseUrl: this.baseUrl,
          hasKey: false,
          databaseOk: readyData?.database ?? true,
          workerLive: workerData?.status === "live",
          message: "Backend reachable. Enter your ADMIN_API_KEY to access data.",
        };
        this.updateStatus(status);
        return status;
      }

      // 3. Check authenticated session
      const sessionRes = await fetch(`${this.baseUrl}/admin/session`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }).catch(() => null);

      if (!sessionRes || sessionRes.status === 401 || sessionRes.status === 403) {
        const status: ConnectionStatus = {
          state: "unauthorized",
          baseUrl: this.baseUrl,
          hasKey: true,
          databaseOk: readyData?.database ?? true,
          workerLive: workerData?.status === "live",
          message: "Invalid API key (401 Unauthorized)",
        };
        this.updateStatus(status);
        return status;
      }

      if (!sessionRes.ok) {
        // Some backends return 404 if no users exist or admin router is not yet active
        if (sessionRes.status === 404) {
          const status: ConnectionStatus = {
            state: "connected",
            baseUrl: this.baseUrl,
            hasKey: true,
            databaseOk: readyData?.database ?? true,
            workerLive: workerData?.status === "live",
            message: "Connected (Admin API running)",
          };
          this.updateStatus(status);
          return status;
        }
      }

      const session = await sessionRes.json().catch(() => null);
      const status: ConnectionStatus = {
        state: "connected",
        baseUrl: this.baseUrl,
        hasKey: true,
        databaseOk: readyData?.database ?? true,
        workerLive: workerData?.status === "live",
        message: session?.name ? `Connected as ${session.name} (${session.role})` : "Connected to Ekatra backend",
      };
      this.updateStatus(status);
      return status;
    } catch (err: any) {
      const status: ConnectionStatus = {
        state: "error",
        baseUrl: this.baseUrl,
        hasKey: !!this.apiKey,
        message: err.message || "Failed to connect",
      };
      this.updateStatus(status);
      return status;
    }
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.updateStatus({
        state: "unauthorized",
        baseUrl: this.baseUrl,
        hasKey: !!this.apiKey,
        message: "Invalid or expired Admin API Key",
      });
      throw new Error("Unauthorized (401): Please verify your ADMIN_API_KEY.");
    }

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const body = await response.json();
        if (body?.error?.message) {
          errorMsg = body.error.message;
        } else if (body?.error) {
          errorMsg = typeof body.error === "string" ? body.error : JSON.stringify(body.error);
        }
      } catch {
        // use default errorMsg
      }
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }
}

export const apiClient = new ApiClient();

