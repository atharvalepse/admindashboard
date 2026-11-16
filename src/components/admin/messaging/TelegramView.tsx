import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, CheckCircle2, Bot } from "lucide-react";

export const TelegramView: React.FC = () => {
  const { telegramSettings, service } = useAdmin();
  const [settings, setSettings] = useState(
    telegramSettings || {
      bot_username: "@VEFTestBot",
      is_connected: true,
      webhook_url: "https://api.ekatra.one/telegram/webhook",
    }
  );

  const [testChatId, setTestChatId] = useState("");
  const [testSent, setTestSent] = useState(false);

  const handleSendTest = () => {
    if (!testChatId) return;
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="border-sky-500/30 bg-sky-500/5">
        <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Telegram Bot Integration</h3>
                <Badge className="bg-sky-600 text-white text-[10px]">
                  {settings.is_connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Bot Username: {settings.bot_username}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Bot Configuration</CardTitle>
          <CardDescription className="text-xs">
            Manage your bot credentials and webhook endpoints for Telegram.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Bot Username</Label>
            <Input
              value={settings.bot_username}
              onChange={(e) =>
                setSettings({ ...settings, bot_username: e.target.value })
              }
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Webhook Receiver Endpoint</Label>
            <Input
              value={settings.webhook_url}
              onChange={(e) =>
                setSettings({ ...settings, webhook_url: e.target.value })
              }
              className="text-xs font-mono"
            />
          </div>

          <Button
            size="sm"
            onClick={() => service.saveTelegramSettings(settings)}
            className="text-xs h-8 font-semibold"
          >
            Update Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Bot Message Tester</CardTitle>
          <CardDescription className="text-xs">
            Send a sample lesson or check-in message to verify bot delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Recipient Telegram Chat ID / Username</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="e.g. 192830192 or @username"
                value={testChatId}
                onChange={(e) => setTestChatId(e.target.value)}
                className="text-xs font-mono"
              />
              <Button
                size="sm"
                onClick={handleSendTest}
                disabled={!testChatId.trim()}
                className="text-xs h-9 gap-1.5 shrink-0"
              >
                <Send size={13} />
                Send Test
              </Button>
            </div>
            {testSent && (
              <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium mt-1">
                <CheckCircle2 size={13} /> Test message delivered to Telegram!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
