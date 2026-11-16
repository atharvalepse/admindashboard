import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiClient, type ConnectionStatus } from "@/services/apiClient";
import { useAdmin } from "@/context/AdminContext";
import {
  Server,
  Key,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Database,
  Cpu,
} from "lucide-react";

export const BackendConnectionModal: React.FC = () => {
  const { refreshData } = useAdmin();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>({
    state: "connecting",
    baseUrl: apiClient.getBaseUrl(),
    hasKey: !!apiClient.getApiKey(),
  });
  const [apiKeyInput, setApiKeyInput] = useState(apiClient.getApiKey() || "");
  const [baseUrlInput, setBaseUrlInput] = useState(apiClient.getBaseUrl() || "");
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = apiClient.onStatusChange((s) => {
      setStatus(s);
    });
    void apiClient.checkConnection();
    return unsub;
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setFeedback(null);
    try {
      if (baseUrlInput !== apiClient.getBaseUrl()) {
        apiClient.setBaseUrl(baseUrlInput);
      }
      if (apiKeyInput.trim()) {
        apiClient.setApiKey(apiKeyInput.trim(), true);
      }
      const newStatus = await apiClient.checkConnection();
      setStatus(newStatus);
      if (newStatus.state === "connected") {
        setFeedback("Successfully connected to backend!");
        await refreshData();
      } else if (newStatus.state === "unauthorized") {
        setFeedback("Backend reachable, but Admin API Key is missing or invalid.");
      } else {
        setFeedback(newStatus.message || "Failed to connect to backend server.");
      }
    } catch (err: any) {
      setFeedback(err.message || "Connection test failed");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndConnect = async () => {
    setIsTesting(true);
    apiClient.setBaseUrl(baseUrlInput);
    if (apiKeyInput.trim()) {
      apiClient.setApiKey(apiKeyInput.trim(), true);
    } else {
      apiClient.clearApiKey();
    }
    const newStatus = await apiClient.checkConnection();
    setStatus(newStatus);
    await refreshData();
    setIsTesting(false);
    setOpen(false);
  };

  const renderBadge = () => {
    if (status.state === "connected") {
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 text-xs font-medium cursor-pointer border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Backend Live
        </Badge>
      );
    }
    if (status.state === "unauthorized") {
      return (
        <Badge
          variant="outline"
          className="gap-1.5 py-1 px-2.5 text-xs font-medium cursor-pointer border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
        >
          <Key size={12} className="text-amber-500" />
          API Key Required
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="gap-1.5 py-1 px-2.5 text-xs font-medium cursor-pointer border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
      >
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        Backend Offline
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderBadge()}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Server size={18} className="text-primary" />
            Backend Connection & Settings
          </DialogTitle>
          <DialogDescription className="text-xs">
            Connect to the local or remote Ekatra backend service to load real courses, learners,
            quizzes, and delivery logs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Status summary banner */}
          <div
            className={`p-3 rounded-lg border flex items-start gap-2.5 ${
              status.state === "connected"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                : status.state === "unauthorized"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
            }`}
          >
            {status.state === "connected" ? (
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            ) : status.state === "unauthorized" ? (
              <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 flex-1">
              <div className="font-semibold capitalize">
                {status.state === "connected"
                  ? "Connected to Ekatra Backend"
                  : status.state === "unauthorized"
                    ? "Authentication Required"
                    : "Backend Disconnected"}
              </div>
              <div className="text-[11px] opacity-90">
                {status.message || "Ensure your Ekatra API server is running on port 3000."}
              </div>
            </div>
          </div>

          {/* Subsystems info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-border">
              <Database size={14} className="text-muted-foreground" />
              <div>
                <div className="text-[10px] text-muted-foreground">PostgreSQL 18</div>
                <div className="font-medium text-foreground">
                  {status.databaseOk ? "Available" : "Not Detected"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-border">
              <Cpu size={14} className="text-muted-foreground" />
              <div>
                <div className="text-[10px] text-muted-foreground">Delivery Worker</div>
                <div className="font-medium text-foreground">
                  {status.workerLive ? "Heartbeat Live" : "Worker Idle"}
                </div>
              </div>
            </div>
          </div>

          {/* API Base URL */}
          <div className="space-y-1.5">
            <Label htmlFor="backend-url" className="text-xs font-medium">
              Backend Base URL
            </Label>
            <Input
              id="backend-url"
              placeholder="http://localhost:3000 (or leave blank for proxy)"
              value={baseUrlInput}
              onChange={(e) => setBaseUrlInput(e.target.value)}
              className="h-8 text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Leave blank to use the Vite proxy forwarding `/admin` to `http://localhost:3000`.
            </p>
          </div>

          {/* Admin API Key */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-key" className="text-xs font-medium flex items-center justify-between">
              <span>Admin API Key (ADMIN_API_KEY)</span>
              {status.hasKey && (
                <span className="text-[10px] text-emerald-500 font-mono">Key saved</span>
              )}
            </Label>
            <Input
              id="admin-key"
              type="password"
              placeholder="e.g. ek_live_... or your bootstrap key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="h-8 text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Stored securely in local storage. Passed as <code>Bearer</code> token for all `/admin` calls.
            </p>
          </div>

          {feedback && (
            <div className="text-xs p-2 rounded bg-muted text-foreground border border-border">
              {feedback}
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw size={12} className={isTesting ? "animate-spin" : ""} />
            Test Connection
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveAndConnect}
            disabled={isTesting}
            className="h-8 text-xs"
          >
            Save & Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

