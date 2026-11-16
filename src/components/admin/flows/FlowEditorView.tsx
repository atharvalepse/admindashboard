import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Flow, FlowNode, FlowEdge, FlowNodeType } from "@/types";
import { FlowNodeCard } from "./FlowNodeCard";
import { NodeInspector } from "./NodeInspector";
import { FlowPreview } from "./FlowPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { generateUUID } from "@/lib/utils";
import {
  ArrowLeft,
  Save,
  Play,
  Plus,
  MessageSquare,
  HelpCircle,
  GitBranch,
  Zap,
  Clock,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";

interface FlowEditorViewProps {
  flow: Flow;
  onSave: (flow: Flow) => void;
  onCancel: () => void;
}

export const FlowEditorView: React.FC<FlowEditorViewProps> = ({
  flow: initialFlow,
  onSave,
  onCancel,
}) => {
  const [flow, setFlow] = useState<Flow>(JSON.parse(JSON.stringify(initialFlow)));
  const [nodes, setNodes] = useState<Node[]>(
    flow.graph.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }))
  );
  const [edges, setEdges] = useState<Edge[]>(
    flow.graph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle || undefined,
      targetHandle: e.targetHandle || undefined,
      animated: true,
    }))
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);

  // Map custom node types for XYFlow
  const nodeTypes = useMemo(
    () => ({
      trigger: FlowNodeCard,
      message: FlowNodeCard,
      ask: FlowNodeCard,
      condition: FlowNodeCard,
      action: FlowNodeCard,
      delay: FlowNodeCard,
      template: FlowNodeCard,
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const handleAddNode = (type: FlowNodeType) => {
    const id = `node_${type}_${Date.now()}`;
    const x = 300 + Math.random() * 100;
    const y = 200 + Math.random() * 100;

    let initialData = {};
    if (type === "message") {
      initialData = {
        title: "New Message",
        text: "Type your message text here...",
        buttons: [{ id: `btn_${Date.now()}`, title: "Continue" }],
      };
    } else if (type === "ask") {
      initialData = {
        title: "Ask Question",
        text: "What is your answer?",
        variable: "user_answer",
        validate: "text",
        maxAttempts: 3,
      };
    } else if (type === "action") {
      initialData = {
        title: "Action",
        actionType: "enroll",
        actionPayload: "course-1",
      };
    } else if (type === "delay") {
      initialData = {
        title: "Delay",
        delayMinutes: 60,
      };
    } else {
      initialData = {
        title: `${type.toUpperCase()} Node`,
      };
    }

    const newNode: Node = {
      id,
      type,
      position: { x, y },
      data: initialData,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
  };

  const handleUpdateNode = (updatedNode: FlowNode) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === updatedNode.id
          ? {
              ...n,
              data: updatedNode.data,
            }
          : n
      )
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
    setSelectedNodeId(null);
  };

  const handleSave = () => {
    const updatedGraph = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type as FlowNodeType,
        position: n.position,
        data: n.data as any,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      })),
    };

    onSave({
      ...flow,
      graph: updatedGraph,
    });
  };

  const selectedNode = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId) as unknown as FlowNode)
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] border border-border rounded-2xl bg-card overflow-hidden shadow-xs">
      {/* Canvas Top Bar */}
      <div className="h-14 px-4 border-b border-border flex items-center justify-between bg-card z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{flow.name}</span>
              <Badge variant="outline" className="capitalize text-[10px]">
                {flow.kind}
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">
              {nodes.length} nodes · {edges.length} connections
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-border">
            <span className="text-xs font-medium text-muted-foreground">
              {flow.isActive ? "Active Bot" : "Draft / Inactive"}
            </span>
            <Switch
              checked={flow.isActive}
              onCheckedChange={(val) => setFlow({ ...flow, isActive: val })}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSimulator(true)}
            className="text-xs gap-1.5 h-8 text-emerald-500 hover:text-emerald-600 border-emerald-500/30"
          >
            <Play size={13} />
            Test Simulator
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground font-semibold"
          >
            <Save size={13} />
            Save Flow
          </Button>
        </div>
      </div>

      {/* Main Flow Canvas Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Palette for Adding Nodes */}
        <div className="w-48 border-r border-border bg-muted/20 p-3 space-y-2 z-10 shrink-0">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
            Add Node
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddNode("message")}
            className="w-full justify-start text-xs gap-2 h-8"
          >
            <MessageSquare size={14} className="text-blue-500" />
            Message
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddNode("ask")}
            className="w-full justify-start text-xs gap-2 h-8"
          >
            <HelpCircle size={14} className="text-amber-500" />
            Ask Question
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddNode("condition")}
            className="w-full justify-start text-xs gap-2 h-8"
          >
            <GitBranch size={14} className="text-purple-500" />
            Condition
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddNode("action")}
            className="w-full justify-start text-xs gap-2 h-8"
          >
            <Zap size={14} className="text-rose-500" />
            Action
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddNode("delay")}
            className="w-full justify-start text-xs gap-2 h-8"
          >
            <Clock size={14} className="text-slate-500" />
            Delay
          </Button>
        </div>

        {/* Interactive ReactFlow Area */}
        <div className="flex-1 h-full w-full relative bg-slate-950/5 dark:bg-slate-950/40">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="transition-colors"
          >
            <Background gap={16} size={1} />
            <Controls className="bg-card border border-border shadow-md rounded-lg overflow-hidden" />
          </ReactFlow>
        </div>

        {/* Right Inspector Sheet for Selected Node */}
        {selectedNode && (
          <NodeInspector
            node={selectedNode}
            onUpdate={handleUpdateNode}
            onDelete={handleDeleteNode}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      {/* Simulator Modal */}
      {showSimulator && (
        <FlowPreview
          graph={{
            nodes: nodes.map((n) => ({
              id: n.id,
              type: n.type as FlowNodeType,
              position: n.position,
              data: n.data as any,
            })),
            edges: edges.map((e) => ({
              id: e.id,
              source: e.source,
              target: e.target,
              sourceHandle: e.sourceHandle,
              targetHandle: e.targetHandle,
            })),
          }}
          onClose={() => setShowSimulator(false)}
        />
      )}
    </div>
  );
};

