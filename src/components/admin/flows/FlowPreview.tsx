import React, { useState } from "react";
import type { FlowGraph, FlowNode } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, RefreshCw, Send, Sparkles } from "lucide-react";

interface FlowPreviewProps {
  graph: FlowGraph;
  onClose: () => void;
}

interface SimulatedMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  buttons?: Array<{ id: string; title: string }>;
}

export const FlowPreview: React.FC<FlowPreviewProps> = ({ graph, onClose }) => {
  const [messages, setMessages] = useState<SimulatedMessage[]>(() => {
    // Start at trigger node
    const trigger = graph.nodes.find((n) => n.type === "trigger");
    if (!trigger) return [];
    
    // Find next node from trigger
    const firstEdge = graph.edges.find((e) => e.source === trigger.id);
    const nextNode = firstEdge
      ? graph.nodes.find((n) => n.id === firstEdge.target)
      : null;

    if (nextNode && nextNode.data.text) {
      return [
        {
          id: "1",
          sender: "bot",
          text: nextNode.data.text,
          buttons: nextNode.data.buttons,
        },
      ];
    }
    return [
      {
        id: "1",
        sender: "bot",
        text: "Flow started. No starting message configured.",
      },
    ];
  });

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: SimulatedMessage = {
      id: String(Date.now()),
      sender: "user",
      text: input.trim(),
    };

    const replyMsg: SimulatedMessage = {
      id: String(Date.now() + 1),
      sender: "bot",
      text: `Received: "${input.trim()}". Flow execution proceeded successfully.`,
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setInput("");
  };

  const handleButtonClick = (btn: { id: string; title: string }) => {
    const userMsg: SimulatedMessage = {
      id: String(Date.now()),
      sender: "user",
      text: btn.title,
    };

    // Find edge from handle
    const edge = graph.edges.find((e) => e.sourceHandle === btn.id);
    const targetNode = edge ? graph.nodes.find((n) => n.id === edge.target) : null;

    const replyMsg: SimulatedMessage = {
      id: String(Date.now() + 1),
      sender: "bot",
      text:
        targetNode?.data.text ||
        `Tapped "${btn.title}". Moving along path...`,
      buttons: targetNode?.data.buttons,
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
  };

  const handleReset = () => {
    const trigger = graph.nodes.find((n) => n.type === "trigger");
    const firstEdge = trigger
      ? graph.edges.find((e) => e.source === trigger.id)
      : null;
    const nextNode = firstEdge
      ? graph.nodes.find((n) => n.id === firstEdge.target)
      : null;

    if (nextNode && nextNode.data.text) {
      setMessages([
        {
          id: "1",
          sender: "bot",
          text: nextNode.data.text,
          buttons: nextNode.data.buttons,
        },
      ]);
    } else {
      setMessages([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0b141a] text-white w-full max-w-sm rounded-3xl border border-border/40 shadow-2xl overflow-hidden flex flex-col h-[580px] font-sans">
        {/* Header */}
        <div className="bg-[#202c33] p-3 flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold">Flow Test Simulator</div>
              <div className="text-[10px] text-emerald-400">Interactive preview</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
              title="Restart test"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#005c4b] text-white rounded-tr-none"
                    : "bg-[#202c33] text-slate-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* Bot Buttons */}
              {msg.buttons && msg.buttons.length > 0 && (
                <div className="space-y-1 mt-1.5 w-full max-w-[85%]">
                  {msg.buttons.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleButtonClick(b)}
                      className="w-full bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] text-emerald-400 py-1.5 px-3 rounded-lg text-center text-xs font-medium transition-colors"
                    >
                      {b.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-2.5 bg-[#202c33] flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your reply..."
            className="text-xs bg-[#2a3942] border-none text-white placeholder:text-slate-400 h-9"
          />
          <Button
            size="icon"
            onClick={handleSend}
            className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

