import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { WhatsAppTemplate } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  RefreshCw,
} from "lucide-react";

export const WhatsAppView: React.FC = () => {
  const { templates, whatsappSettings, service } = useAdmin();
  const [submitOpen, setSubmitOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateCategory, setTemplateCategory] = useState<"UTILITY" | "MARKETING">("UTILITY");
  const [templateBody, setTemplateBody] = useState("");

  const [settings, setSettings] = useState(
    whatsappSettings || {
      waba_id: "waba_991823102",
      phone_number: "+1 659-277-2030",
      auto_reply_enabled: true,
      cooldown_minutes: 120,
      waiting_message:
        "A team member has been notified and will reply shortly. Thanks for your patience!",
    }
  );

  const handleSubmitTemplate = async () => {
    if (!templateName.trim() || !templateBody.trim()) return;
    await service.submitTemplate({
      name: templateName.trim().toLowerCase().replace(/\s+/g, "_"),
      language: "en",
      category: templateCategory,
      body: templateBody.trim(),
    });
    setSubmitOpen(false);
    setTemplateName("");
    setTemplateBody("");
  };

  const handleSaveSettings = async () => {
    await service.saveWhatsAppSettings(settings);
  };

  return (
    <div className="space-y-6">
      {/* WABA Status Banner */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <MessageCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">WhatsApp Business Account (WABA)</h3>
                <Badge className="bg-emerald-600 text-white text-[10px]">Connected</Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Phone: {settings.phone_number} · WABA ID: {settings.waba_id}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setSubmitOpen(true)}
            className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus size={14} />
            Submit Meta Template
          </Button>
        </CardContent>
      </Card>

      {/* Meta Message Templates Catalog */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Approved Message Templates
              </CardTitle>
              <CardDescription className="text-xs">
                Synchronized directly with Meta Cloud API. These templates can initiate learner outreach outside the 24-hour reply window.
              </CardDescription>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {templates.length} Active Templates
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="border border-border rounded-xl p-4 space-y-2 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold font-mono text-xs text-foreground">
                    {tpl.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">
                      {tpl.category}
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        tpl.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {tpl.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/60">
                  {tpl.body}
                </p>
                {tpl.buttons && tpl.buttons.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Buttons:
                    </span>
                    {tpl.buttons.map((b, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Reply & Cooldown Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Auto-Reply & Help Fallback Configuration
          </CardTitle>
          <CardDescription className="text-xs">
            Manage automated menus sent when learners type messages outside of active course progressions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-semibold">Enable Automatic Fallback Menu</Label>
              <p className="text-[11px] text-muted-foreground">
                Sends the help menu or active fallback flow when a message is not recognized.
              </p>
            </div>
            <Switch
              checked={settings.auto_reply_enabled}
              onCheckedChange={(val) =>
                setSettings({ ...settings, auto_reply_enabled: val })
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Cooldown Period (Minutes)</Label>
            <Input
              type="number"
              value={settings.cooldown_minutes}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cooldown_minutes: parseInt(e.target.value, 10) || 60,
                })
              }
              className="text-xs max-w-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Prevents spamming the learner if they send multiple unrecognized messages in succession.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Staff Waiting Acknowledgement Message</Label>
            <Textarea
              value={settings.waiting_message}
              onChange={(e) =>
                setSettings({ ...settings, waiting_message: e.target.value })
              }
              rows={3}
              className="text-xs"
            />
          </div>

          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="text-xs h-8 font-semibold"
          >
            Save WhatsApp Settings
          </Button>
        </CardContent>
      </Card>

      {/* Submit Template Modal */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Submit WhatsApp Template to Meta
            </DialogTitle>
            <DialogDescription className="text-xs">
              Templates must adhere to Meta’s utility policies to receive instant automated approval.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Template Name (Lowercase snake_case)</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. course_milestone_update"
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <select
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value as any)}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs text-foreground"
              >
                <option value="UTILITY">UTILITY (Transactional / Course Progression)</option>
                <option value="MARKETING">MARKETING (Promotional)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Template Body with Variables</Label>
              <Textarea
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                placeholder="Hello {{1}}, you have successfully completed {{2}}..."
                rows={4}
                className="text-xs"
              />
              <span className="text-[10px] text-muted-foreground">
                Use {"{{1}}"}, {"{{2}}"} for placeholders.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitOpen(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitTemplate}
              disabled={!templateName.trim() || !templateBody.trim()}
              className="text-xs h-8"
            >
              Submit to Meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

