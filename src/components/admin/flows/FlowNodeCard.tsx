import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowNodeType, FlowNodeData } from "@/types";
import {
  MessageSquare,
  HelpCircle,
  GitBranch,
  Zap,
  Clock,
  LayoutTemplate,
  Play,
} from "lucide-react";

const NODE_CONFIG: Record<
  FlowNodeType,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    border: string;
    badge: string;
  }
> = {
  trigger: {
    icon: Play,
    color: "bg-emerald-500/10 text-emerald-500",
    border: "border-emerald-500/40",
    badge: "Trigger",
  },
  message: {
    icon: MessageSquare,
    color: "bg-blue-500/10 text-blue-500",
    border: "border-blue-500/40",
    badge: "Message",
  },
  ask: {
    icon: HelpCircle,
    color: "bg-amber-500/10 text-amber-500",
    border: "border-amber-500/40",
    badge: "Ask Question",
  },
  condition: {
    icon: GitBranch,
    color: "bg-purple-500/10 text-purple-500",
    border: "border-purple-500/40",
    badge: "Condition",
  },
  action: {
    icon: Zap,
    color: "bg-rose-500/10 text-rose-500",
    border: "border-rose-500/40",
    badge: "Action",
  },
  delay: {
    icon: Clock,
    color: "bg-slate-500/10 text-slate-500",
    border: "border-slate-500/40",
    badge: "Delay",
  },
  template: {
    icon: LayoutTemplate,
    color: "bg-indigo-500/10 text-indigo-500",
    border: "border-indigo-500/40",
    badge: "Meta Template",
  },
};

export const FlowNodeCard = memo(({ id, type, data, selected }: NodeProps) => {
  const nodeType = (type || "message") as FlowNodeType;
  const config = NODE_CONFIG[nodeType] || NODE_CONFIG.message;
  const Icon = config.icon;
  const nodeData = data as FlowNodeData;

  const isTrigger = nodeType === "trigger";

  return (
    <div
      className={`w-64 rounded-xl border bg-card text-card-foreground shadow-md transition-all select-none ${
        selected ? "ring-2 ring-primary border-primary shadow-lg" : config.border
      }`}
    >
      {/* Target input handle (unless Trigger) */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}

      {/* Node Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/60 bg-muted/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${config.color}`}>
            <Icon size={14} />
          </div>
          <span className="text-xs font-semibold truncate max-w-[140px]">
            {nodeData.title || config.badge}
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          {config.badge}
        </span>
      </div>

      {/* Node Body Content */}
      <div className="p-3 text-xs space-y-2">
        {nodeData.text && (
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {nodeData.text}
          </p>
        )}

        {/* Interactive Buttons / Choices Handles */}
        {nodeData.buttons && nodeData.buttons.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {nodeData.buttons.map((btn) => (
              <div
                key={btn.id}
                className="relative flex items-center justify-between px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium"
              >
                <span className="truncate max-w-[180px]">{btn.title}</span>
                <Handle
                  id={btn.id}
                  type="source"
                  position={Position.Right}
                  className="w-2.5 h-2.5 bg-blue-500 border-2 border-background -right-2"
                />
              </div>
            ))}
          </div>
        )}

        {/* Ask Node Info */}
        {nodeType === "ask" && (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded">
            <span>Variable: <code className="text-primary font-mono">{nodeData.variable || "var"}</code></span>
            <span className="capitalize">{nodeData.validate || "text"}</span>
          </div>
        )}

        {/* Action Node Info */}
        {nodeType === "action" && (
          <div className="text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded font-mono">
            {nodeData.actionType || "enroll"}: {nodeData.actionPayload || "course"}
          </div>
        )}
      </div>

      {/* Default source output handle at bottom (if not using button handles) */}
      {(!nodeData.buttons || nodeData.buttons.length === 0) && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}
    </div>
  );
});

FlowNodeCard.displayName = "FlowNodeCard";

