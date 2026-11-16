import React from "react";
import type { CoursePacing, PacingMode } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Calendar } from "lucide-react";

interface CoursePacingSettingsProps {
  pacing?: CoursePacing;
  onChange: (pacing: CoursePacing) => void;
}

export const CoursePacingSettings: React.FC<CoursePacingSettingsProps> = ({
  pacing = {
    mode: "immediate",
    gapDays: 1,
    unlockTime: "09:00",
    timezone: "Asia/Kolkata",
  },
  onChange,
}) => {
  const handleModeChange = (mode: PacingMode) => {
    onChange({ ...pacing, mode });
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-card space-y-4">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-primary" />
        <h4 className="text-sm font-semibold">Course Pacing & Scheduling</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => handleModeChange("immediate")}
          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
            pacing.mode === "immediate"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:bg-accent text-foreground"
          }`}
        >
          <div className="font-semibold text-xs">Self-Paced (Immediate)</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Learner unlocks each next lesson as soon as they finish the quiz.
          </div>
        </div>

        <div
          onClick={() => handleModeChange("fixed_time")}
          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
            pacing.mode === "fixed_time"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:bg-accent text-foreground"
          }`}
        >
          <div className="font-semibold text-xs">Daily Fixed-Time Delivery</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            New module arrives at an exact time every day (e.g. 9:00 AM).
          </div>
        </div>

        <div
          onClick={() => handleModeChange("after_completion")}
          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
            pacing.mode === "after_completion"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:bg-accent text-foreground"
          }`}
        >
          <div className="font-semibold text-xs">Cooldown Delay</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Next lesson unlocks 24 hours after previous module completion.
          </div>
        </div>
      </div>

      {pacing.mode === "fixed_time" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <Label className="text-xs">Unlock Time (24h)</Label>
            <Input
              type="time"
              value={pacing.unlockTime}
              onChange={(e) => onChange({ ...pacing, unlockTime: e.target.value })}
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Gap Days Between Modules</Label>
            <Input
              type="number"
              min={1}
              max={7}
              value={pacing.gapDays}
              onChange={(e) =>
                onChange({ ...pacing, gapDays: parseInt(e.target.value, 10) || 1 })
              }
              className="text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Timezone</Label>
            <Input
              value={pacing.timezone}
              onChange={(e) => onChange({ ...pacing, timezone: e.target.value })}
              placeholder="e.g. Asia/Kolkata"
              className="text-xs font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
};
