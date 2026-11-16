import React from "react";
import type { FlowNode, FlowNodeType, FlowNodeData } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";

interface NodeInspectorProps {
  node: FlowNode | null;
  onUpdate: (updatedNode: FlowNode) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onUpdate,
  onDelete,
  onClose,
}) => {
  if (!node) return null;

  const data = node.data;

  const handleUpdateData = (partialData: Partial<FlowNodeData>) => {
    onUpdate({
      ...node,
      data: {
        ...data,
        ...partialData,
      },
    });
  };

  const handleAddButton = () => {
    const buttons = data.buttons || [];
    if (buttons.length >= 3) return;
    const newBtn = {
      id: `btn_${Date.now()}`,
      title: `Option ${buttons.length + 1}`,
    };
    handleUpdateData({ buttons: [...buttons, newBtn] });
  };

  const handleButtonChange = (idx: number, title: string) => {
    const buttons = [...(data.buttons || [])];
    buttons[idx] = { ...buttons[idx], title };
    handleUpdateData({ buttons });
  };

  const handleRemoveButton = (idx: number) => {
    const buttons = (data.buttons || []).filter((_, i) => i !== idx);
    handleUpdateData({ buttons });
  };

  return (
    <div className="w-80 h-full border-l border-border bg-card p-4 overflow-y-auto space-y-4 shrink-0 shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="font-semibold text-sm">Node Properties</h3>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            Type: {node.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Node Title</Label>
        <Input
          value={data.title || ""}
          onChange={(e) => handleUpdateData({ title: e.target.value })}
          placeholder="e.g. Welcome Message"
          className="text-xs"
        />
      </div>

      {/* Message / Ask Text */}
      {(node.type === "message" || node.type === "ask" || node.type === "trigger") && (
        <div className="space-y-1.5">
          <Label className="text-xs">Message Text</Label>
          <Textarea
            value={data.text || ""}
            onChange={(e) => handleUpdateData({ text: e.target.value })}
            placeholder="Type WhatsApp message body here..."
            rows={4}
            className="text-xs"
          />
        </div>
      )}

      {/* Message Buttons */}
      {node.type === "message" && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Quick Reply Buttons (Max 3)</Label>
            {(!data.buttons || data.buttons.length < 3) && (
              <button
                type="button"
                onClick={handleAddButton}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Button
              </button>
            )}
          </div>

          <div className="space-y-2">
            {(data.buttons || []).map((btn, idx) => (
              <div key={btn.id} className="flex items-center gap-2">
                <Input
                  value={btn.title}
                  onChange={(e) => handleButtonChange(idx, e.target.value)}
                  placeholder={`Button ${idx + 1}`}
                  className="text-xs flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveButton(idx)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ask Question Settings */}
      {node.type === "ask" && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <Label className="text-xs">Save Answer into Variable</Label>
            <Input
              value={data.variable || ""}
              onChange={(e) => handleUpdateData({ variable: e.target.value })}
              placeholder="e.g. learner_name"
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Validation Format</Label>
            <select
              value={data.validate || "text"}
              onChange={(e) => handleUpdateData({ validate: e.target.value as any })}
              className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs text-foreground"
            >
              <option value="text">Any Text</option>
              <option value="number">Number</option>
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Retry Text on Invalid Input</Label>
            <Input
              value={data.retryText || ""}
              onChange={(e) => handleUpdateData({ retryText: e.target.value })}
              placeholder="Please provide a valid input..."
              className="text-xs"
            />
          </div>
        </div>
      )}

      {/* Action Settings */}
      {node.type === "action" && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <Label className="text-xs">Action Type</Label>
            <select
              value={data.actionType || "enroll"}
              onChange={(e) => handleUpdateData({ actionType: e.target.value as any })}
              className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs text-foreground"
            >
              <option value="enroll">Enroll in Course</option>
              <option value="tag">Tag Contact</option>
              <option value="handoff">Handoff to Staff</option>
              <option value="start_course">Start Course Progression</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Target Identifier / Payload</Label>
            <Input
              value={data.actionPayload || ""}
              onChange={(e) => handleUpdateData({ actionPayload: e.target.value })}
              placeholder="e.g. course-1"
              className="text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* Delete Node */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(node.id)}
          className="w-full gap-2 text-xs h-8"
        >
          <Trash2 size={13} />
          Delete Node
        </Button>
      </div>
    </div>
  );
};
