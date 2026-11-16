import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { ChatConversation, PlatformType } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  Send,
  MessageCircle,
  MessageSquare,
  AlertTriangle,
  CheckCheck,
  Check,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";

export const ChatHistoryView: React.FC = () => {
  const {
    chats,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
    resolveAttention,
    templates,
  } = useAdmin();

  const [platformFilter, setPlatformFilter] = useState<"all" | PlatformType>("all");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // Active chat
  const activeChat =
    chats.find((c) => c.id === selectedChatId) || chats[0] || null;

  // Filter list
  const filteredChats = chats.filter((c) => {
    const matchPlatform =
      platformFilter === "all" || c.platform === platformFilter;
    const matchAttention = !attentionOnly || c.needs_attention;
    const matchSearch =
      c.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone_number || "").includes(search) ||
      (c.chat_id || "").toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchAttention && matchSearch;
  });

  const handleSend = async () => {
    if (!activeChat || !messageText.trim()) return;
    await sendMessage(activeChat.id, messageText.trim());
    setMessageText("");
  };

  const handleSendTemplate = async (templateName: string, body: string) => {
    if (!activeChat) return;
    await sendMessage(activeChat.id, body, templateName);
    setTemplateDialogOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-130px)] border border-border rounded-2xl bg-card overflow-hidden shadow-xs">
      {/* Left Sidebar: Conversations List */}
      <div className="w-80 md:w-96 border-r border-border flex flex-col shrink-0 bg-card">
        {/* Search & Filter Header */}
        <div className="p-3 border-b border-border space-y-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {(["all", "whatsapp", "telegram"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                    platformFilter === p
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setAttentionOnly(!attentionOnly)}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                attentionOnly
                  ? "bg-destructive/10 text-destructive font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertTriangle size={12} />
              <span>Needs Attention</span>
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No conversations found.
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = activeChat?.id === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected ? "bg-accent/70 border-l-4 border-l-primary" : "hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground truncate max-w-[160px]">
                        {chat.contact_name}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          chat.platform === "whatsapp"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {chat.platform}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(chat.last_interaction_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground truncate line-clamp-1">
                    {chat.last_message}
                  </p>

                  {/* Attention Tag */}
                  {chat.needs_attention && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <Badge
                        variant="destructive"
                        className="text-[9px] px-1.5 py-0 h-4 gap-1 font-semibold"
                      >
                        <AlertTriangle size={10} />
                        Needs Attention
                      </Badge>
                      {chat.attention_reason && (
                        <span className="text-[10px] text-destructive truncate">
                          {chat.attention_reason}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Live Chat Feed */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-background/50">
          {/* Chat Header */}
          <div className="h-16 px-4 border-b border-border bg-card flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {activeChat.contact_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-foreground">
                    {activeChat.contact_name}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    {activeChat.phone_number || activeChat.chat_id}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Channel: <span className="capitalize font-medium">{activeChat.platform}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeChat.needs_attention && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAttention(activeChat.id)}
                  className="gap-1.5 text-xs h-8 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <CheckCircle2 size={14} />
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>

          {/* Meta 24-Hour Reply Window Banner */}
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
              activeChat.reply_window_open
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>
                {activeChat.reply_window_open
                  ? "Meta 24-hour reply window is OPEN. Free-form messaging active."
                  : "Meta 24-hour reply window is CLOSED. Free-form messages will be rejected by WhatsApp."}
              </span>
            </div>
            {!activeChat.reply_window_open && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTemplateDialogOpen(true)}
                className="h-6 text-[11px] gap-1 px-2 border-amber-500/40"
              >
                <FileText size={11} />
                Send Template
              </Button>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeChat.messages.map((msg) => {
              const isLearner = msg.sender === "learner";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isLearner ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      isLearner
                        ? "bg-card border border-border text-foreground rounded-tl-none"
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    }`}
                  >
                    {msg.template_name && (
                      <div className="text-[10px] font-mono opacity-80 mb-1 flex items-center gap-1">
                        <FileText size={11} />
                        Template: {msg.template_name}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isLearner ? "text-muted-foreground" : "text-primary-foreground/70"
                      }`}
                    >
                      <span>
                        {new Date(msg.sent_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {!isLearner && (
                        <span>
                          {msg.status === "read" ? (
                            <CheckCheck size={12} className="text-sky-300" />
                          ) : (
                            <Check size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Message Composer */}
          <div className="p-3 border-t border-border bg-card flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplateDialogOpen(true)}
                className="text-xs h-8 gap-1.5 shrink-0"
              >
                <FileText size={13} />
                <span>Templates</span>
              </Button>
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={
                  activeChat.reply_window_open
                    ? "Type your response here..."
                    : "Window closed. Select a template to initiate conversation..."
                }
                disabled={!activeChat.reply_window_open}
                className="text-xs h-9 flex-1"
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!activeChat.reply_window_open || !messageText.trim()}
                className="h-9 px-4 gap-1.5 text-xs font-semibold shrink-0"
              >
                <Send size={13} />
                <span>Send</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
          Select a conversation to start chatting.
        </div>
      )}

      {/* Meta Template Picker Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Select Approved Meta Template
            </DialogTitle>
            <DialogDescription className="text-xs">
              Templates bypass the 24-hour reply window restriction to re-engage learners.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="border border-border rounded-xl p-3 hover:border-primary/50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs font-mono text-primary">
                    {tpl.name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {tpl.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{tpl.body}</p>
                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    onClick={() => handleSendTemplate(tpl.name, tpl.body)}
                    className="text-xs h-7 gap-1"
                  >
                    <Send size={12} />
                    Send This Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
