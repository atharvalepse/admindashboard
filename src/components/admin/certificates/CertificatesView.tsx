import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Award,
  Send,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Search,
  Plus,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { Certificate } from "@/types";

export const CertificatesView: React.FC = () => {
  const { certificates, courses, sendCertificate, generateCertificate, refreshData } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  // Modal State for Generating Certificate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [learnerName, setLearnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id ? String(courses[0].id) : "1",
  );
  const [sendNow, setSendNow] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredCerts = certificates.filter(
    (c) =>
      c.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendToWhatsApp = async (cert: Certificate) => {
    setSendingId(cert.enrollmentId);
    setActionNotice(null);
    try {
      await sendCertificate(cert.enrollmentId);
      setActionNotice({
        type: "success",
        text: `Certificate sent to WhatsApp for ${cert.learnerName}!`,
      });
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err: any) {
      setActionNotice({
        type: "error",
        text: err.message || "Failed to send certificate to WhatsApp.",
      });
    } finally {
      setSendingId(null);
    }
  };

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}/certificates/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerName.trim() || !phone.trim() || !selectedCourseId) {
      setActionNotice({ type: "error", text: "Please provide learner name, phone, and course." });
      return;
    }

    setIsGenerating(true);
    setActionNotice(null);
    try {
      const courseNum = parseInt(selectedCourseId, 10) || 1;
      const newCert = await generateCertificate({
        phone: phone.trim(),
        learnerName: learnerName.trim(),
        courseId: courseNum,
        sendNow,
      });

      setIsModalOpen(false);
      setLearnerName("");
      setPhone("");
      setActionNotice({
        type: "success",
        text: `Certificate ${newCert.code} generated successfully for ${newCert.learnerName}!${
          sendNow ? " Dispatching to WhatsApp." : ""
        }`,
      });
      setTimeout(() => setActionNotice(null), 6000);
    } catch (err: any) {
      setActionNotice({
        type: "error",
        text: err.message || "Failed to generate certificate.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {actionNotice && (
        <div
          className={`p-4 rounded-lg border flex items-center justify-between text-sm ${
            actionNotice.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-500 shrink-0" />
            )}
            <span>{actionNotice.text}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActionNotice(null)}
            className="h-7 text-xs"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Certificates
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-foreground">{certificates.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Issued for course completions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Sent via WhatsApp
            </CardTitle>
            <Send className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-foreground">
              {certificates.length > 0 ? certificates.length : 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Delivered with verification codes</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              PDF Engine
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-foreground">PDFKit Vector</div>
            <p className="text-[11px] text-muted-foreground mt-1">High-res landscape A4 generation</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Security & Tamper-Proof
            </CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-foreground">HMAC-SHA256</div>
            <p className="text-[11px] text-muted-foreground mt-1">Signed verifiable hash codes</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Search + Issue Certificate Modal */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by learner name, course, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshData()}
            className="gap-1.5 h-9 text-xs"
          >
            <RefreshCw size={13} />
            Refresh
          </Button>

          {/* Issue Certificate Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 h-9 text-xs font-medium">
                <Plus size={14} />
                Generate & Issue Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleGenerateSubmit}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-base">
                    <Award size={18} className="text-primary" />
                    Issue Course Certificate
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Manually generate and award an official completion certificate to a learner,
                    with direct WhatsApp dispatch.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3 text-xs">
                  <div className="space-y-1.5">
                    <Label htmlFor="cert-name" className="text-xs font-medium">
                      Learner Full Name
                    </Label>
                    <Input
                      id="cert-name"
                      placeholder="e.g. Priya Sharma"
                      value={learnerName}
                      onChange={(e) => setLearnerName(e.target.value)}
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cert-phone" className="text-xs font-medium">
                      WhatsApp Phone Number (E.164)
                    </Label>
                    <Input
                      id="cert-phone"
                      placeholder="e.g. +919876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-8 text-xs font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Must include country code (e.g. +91 for India, +1 for US).
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cert-course" className="text-xs font-medium">
                      Course
                    </Label>
                    <select
                      id="cert-course"
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full h-8 text-xs px-2.5 rounded-md border border-input bg-background text-foreground"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="send-now"
                      checked={sendNow}
                      onChange={(e) => setSendNow(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                    />
                    <Label htmlFor="send-now" className="text-xs cursor-pointer">
                      Send certificate immediately to learner's WhatsApp
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isGenerating}
                    className="h-8 text-xs gap-1.5"
                  >
                    {isGenerating && <RefreshCw size={12} className="animate-spin" />}
                    Generate Certificate
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Certificates Table */}
      <Card className="border-border">
        <CardHeader className="p-4 border-b border-border">
          <CardTitle className="text-sm font-semibold">Issued Certificates Registry</CardTitle>
          <CardDescription className="text-xs">
            Official completion records with verifiable HMAC hashes and WhatsApp delivery triggers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCerts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
              <Award size={32} className="mx-auto opacity-30 text-primary" />
              <div className="font-medium text-foreground">No certificates found</div>
              <p className="text-[11px] max-w-sm mx-auto">
                Certificates are issued automatically when learners complete the final lesson of a
                course, or manually via the "Generate & Issue Certificate" button above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border font-medium">
                  <tr>
                    <th className="py-3 px-4">Learner</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Certificate ID</th>
                    <th className="py-3 px-4">Issued Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {cert.learnerName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{cert.courseTitle}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
                          {cert.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{cert.issuedAt}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send to WhatsApp button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendToWhatsApp(cert)}
                            disabled={sendingId === cert.enrollmentId}
                            className="h-7 text-[11px] gap-1 px-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                            title="Send certificate directly to student's WhatsApp"
                          >
                            <Send size={11} className={sendingId === cert.enrollmentId ? "animate-spin" : ""} />
                            <span>Send to WhatsApp</span>
                          </Button>

                          {/* View PDF */}
                          <a
                            href={cert.pdfUrl || `/certificates/${cert.code}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[11px] gap-1 px-2 text-foreground"
                              title="Download vector PDF"
                            >
                              <FileText size={12} />
                              <span>PDF</span>
                            </Button>
                          </a>

                          {/* Web View */}
                          <a
                            href={cert.previewUrl || `/certificates/${cert.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[11px] gap-1 px-2 text-foreground"
                              title="View responsive web certificate"
                            >
                              <ExternalLink size={12} />
                              <span>Web</span>
                            </Button>
                          </a>

                          {/* Copy Link */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(cert.code)}
                            className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                            title="Copy certificate link"
                          >
                            {copiedCode === cert.code ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

