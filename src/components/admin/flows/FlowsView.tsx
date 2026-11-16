import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { Flow, FlowKind } from "@/types";
import { FlowEditorView } from "./FlowEditorView";
import { FlowResponsesDialog } from "./FlowResponsesDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateUUID } from "@/lib/utils";
import {
  Workflow,
  Plus,
  Play,
  Edit3,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Calendar,
} from "lucide-react";

export const FlowsView: React.FC = () => {
  const {
    flows,
    selectedFlowId,
    setSelectedFlowId,
    saveFlow,
    toggleFlowActive,
  } = useAdmin();

  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowKind, setNewFlowKind] = useState<FlowKind>("keyword");

  const [responsesFlow, setResponsesFlow] = useState<Flow | null>(null);

  const activeFlow = isCreating
    ? {
        id: generateUUID(),
        name: newFlowName || "New Conversational Flow",
        kind: newFlowKind,
        isActive: false,
        responsesCount: 0,
        updatedAt: new Date().toISOString(),
        graph: {
          nodes: [
            {
              id: "node-trigger",
              type: "trigger" as const,
              position: { x: 50, y: 150 },
              data: { title: "Inbound Trigger" },
            },
            {
              id: "node-msg-1",
              type: "message" as const,
              position: { x: 300, y: 150 },
              data: {
                title: "Welcome Greeting",
                text: "Hello! Thank you for connecting with us.",
                buttons: [{ id: "b1", title: "Get Started" }],
              },
            },
          ],
          edges: [
            {
              id: "e-1",
              source: "node-trigger",
              target: "node-msg-1",
            },
          ],
        },
      }
    : flows.find((f) => f.id === selectedFlowId);

  if (activeFlow) {
    return (
      <FlowEditorView
        flow={activeFlow}
        onSave={async (updated) => {
          await saveFlow(updated);
          setIsCreating(false);
          setSelectedFlowId(null);
        }}
        onCancel={() => {
          setIsCreating(false);
          setSelectedFlowId(null);
        }}
      />
    );
  }

  const handleStartCreate = () => {
    setCreateDialogOpen(false);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            WhatsApp Flow Canvas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Design interactive chatbot journeys, auto-replies, and survey responses
          </p>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2 h-9 text-xs font-semibold shrink-0"
        >
          <Plus size={15} />
          Create New Flow
        </Button>
      </div>

      {/* Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {flows.map((flow) => (
          <Card
            key={flow.id}
            className="flex flex-col justify-between hover:border-primary/50 transition-all shadow-xs group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline" className="capitalize text-[10px]">
                  {flow.kind.replace("_", " ")}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {flow.isActive ? "Active" : "Paused"}
                  </span>
                  <Switch
                    checked={flow.isActive}
                    onCheckedChange={(val) => toggleFlowActive(flow.id, val)}
                  />
                </div>
              </div>
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                {flow.name}
              </CardTitle>
              {flow.keywords && flow.keywords.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mt-1">
                  <span className="text-[10px] text-muted-foreground">Keywords:</span>
                  {flow.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-1.5 py-0.2 rounded bg-muted text-[10px] font-mono text-foreground"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-2 py-2 border-y border-border text-center text-xs">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium">
                    Nodes
                  </div>
                  <div className="font-semibold mt-0.5">
                    {flow.graph.nodes.length}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium">
                    Responses Captured
                  </div>
                  <div className="font-semibold mt-0.5">
                    {flow.responsesCount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFlowId(flow.id)}
                  className="gap-1.5 h-8 text-xs flex-1"
                >
                  <Edit3 size={13} />
                  Open Canvas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResponsesFlow(flow)}
                  className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                  title="View Responses"
                >
                  <FileSpreadsheet size={13} />
                  <span>Responses</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Flow Modal */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Create Conversational Flow
            </DialogTitle>
            <DialogDescription className="text-xs">
              Choose the flow trigger kind and name to start building in the canvas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Flow Name</Label>
              <Input
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
                placeholder="e.g. Lead Qualification Bot"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Flow Trigger Kind</Label>
              <select
                value={newFlowKind}
                onChange={(e) => setNewFlowKind(e.target.value as FlowKind)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
              >
                <option value="keyword">Keyword (Inbound Match)</option>
                <option value="fallback">Fallback (Unrecognized Messages)</option>
                <option value="course_start">Course Start Onboarding</option>
                <option value="course_complete">Course Completion Survey</option>
                <option value="broadcast">Outbound Broadcast Flow</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateDialogOpen(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleStartCreate}
              disabled={!newFlowName.trim()}
              className="text-xs h-8"
            >
              Create & Open Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Responses Dialog */}
      {responsesFlow && (
        <FlowResponsesDialog
          open={Boolean(responsesFlow)}
          onOpenChange={(open) => !open && setResponsesFlow(null)}
          flowName={responsesFlow.name}
        />
      )}
    </div>
  );
};
