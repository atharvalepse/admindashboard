import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Table as TableIcon } from "lucide-react";

interface FlowResponsesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flowName: string;
}

export const FlowResponsesDialog: React.FC<FlowResponsesDialogProps> = ({
  open,
  onOpenChange,
  flowName,
}) => {
  // Sample recorded responses
  const mockResponses = [
    {
      phone: "+919766072308",
      step: "Ask Learner Name",
      variable: "learner_name",
      value: "Rajesh Kumar",
      submitted_at: "2026-11-16 18:30",
    },
    {
      phone: "+919822334455",
      step: "Ask Learner Name",
      variable: "learner_name",
      value: "Priya Sharma",
      submitted_at: "2026-11-16 17:05",
    },
    {
      phone: "+919876543210",
      step: "Language Selection",
      variable: "lang",
      value: "English",
      submitted_at: "2026-11-15 14:22",
    },
    {
      phone: "+919123456789",
      step: "Course Feedback",
      variable: "rating",
      value: "5 stars - very clear",
      submitted_at: "2026-11-15 11:10",
    },
  ];

  const handleExportCSV = () => {
    const headers = "Phone Number,Flow Step,Variable,Value,Submitted At\n";
    const rows = mockResponses
      .map(
        (r) =>
          `"${r.phone}","${r.step}","${r.variable}","${r.value}","${r.submitted_at}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${flowName.replace(/\s+/g, "_")}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <DialogTitle className="text-base font-semibold">
              Flow Responses: {flowName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Learner inputs captured across variable prompts in this flow.
            </DialogDescription>
          </div>
          <Button
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5 h-8 mr-6"
          >
            <Download size={13} />
            Export CSV
          </Button>
        </DialogHeader>

        <div className="border border-border rounded-xl overflow-hidden mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="py-2.5 px-3 font-medium">Learner Phone</th>
                <th className="py-2.5 px-3 font-medium">Step</th>
                <th className="py-2.5 px-3 font-medium">Variable</th>
                <th className="py-2.5 px-3 font-medium">Recorded Value</th>
                <th className="py-2.5 px-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockResponses.map((r, i) => (
                <tr key={i} className="hover:bg-accent/30">
                  <td className="py-2.5 px-3 font-mono font-medium">{r.phone}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{r.step}</td>
                  <td className="py-2.5 px-3 font-mono text-primary">{r.variable}</td>
                  <td className="py-2.5 px-3 font-semibold text-foreground">
                    {r.value}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground text-[11px]">
                    {r.submitted_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
