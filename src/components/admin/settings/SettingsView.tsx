import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, ShieldCheck, Bell, Key } from "lucide-react";

export const SettingsView: React.FC = () => {
  const [orgName, setOrgName] = useState("Ekatra Learning");
  const [adminName, setAdminName] = useState("Aarav Sharma");
  const [adminEmail, setAdminEmail] = useState("a@ekatra.one");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-xs text-muted-foreground">
          Manage system configurations, organization branding, and staff notifications
        </p>
      </div>

      {/* Organization Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Organization Profile</CardTitle>
          <CardDescription className="text-xs">
            Appears on WhatsApp bot headers and generated certificates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Organization / Project Name</Label>
            <Input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="text-xs max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Staff Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Your Staff Profile</CardTitle>
          <CardDescription className="text-xs">
            Update personal account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email Address</Label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Notifications & Alerts</CardTitle>
          <CardDescription className="text-xs">
            Manage alerts when learners request human intervention in chat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between max-w-md">
            <div>
              <Label className="text-xs font-semibold">Human Intervention Alerts</Label>
              <p className="text-[11px] text-muted-foreground">
                Notify staff when a learner flags "Talk to a person"
              </p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* API Key info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Key size={16} className="text-primary" />
            <span>Connection & Webhook Security</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Webhook signatures and gateway authentication tokens.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-xs font-mono">
            <div className="text-muted-foreground">Meta Webhook Receiver:</div>
            <div className="text-foreground font-semibold">
              https://your-domain.com/api/public/whatsapp/webhook
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleSave} className="text-xs h-9 px-5 font-semibold">
          Save Changes
        </Button>
        {saved && (
          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <CheckCircle2 size={14} /> Settings updated successfully
          </span>
        )}
      </div>
    </div>
  );
};
