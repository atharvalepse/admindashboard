import React from "react";
import { Sparkles, CheckCheck } from "lucide-react";

interface WhatsAppPreviewProps {
  courseTitle: string;
  dayTitle: string;
  paragraphs: Array<{ id: string; content: string }>;
  quizQuestion?: {
    question: string;
    options: string[];
  };
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  courseTitle,
  dayTitle,
  paragraphs,
  quizQuestion,
}) => {
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-[320px] shrink-0 border border-border rounded-3xl bg-[#0b141a] text-white p-3 shadow-xl flex flex-col font-sans select-none">
      {/* Phone Notch & Header */}
      <div className="bg-[#202c33] rounded-2xl p-2.5 mb-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
            <Sparkles size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold truncate max-w-[170px]">
              MicroLearn Bot
            </span>
            <span className="text-[10px] text-emerald-400">official business</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed Area */}
      <div className="flex-1 overflow-y-auto space-y-2 p-1 min-h-[380px] max-h-[480px]">
        {/* Welcome Message Bubble */}
        <div className="bg-[#202c33] rounded-lg p-2.5 max-w-[90%] text-xs leading-relaxed shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-400 mb-1">
            {courseTitle || "Course Title"}
          </div>
          <div className="text-[11px] font-medium text-slate-200 mb-1">
            {dayTitle || "Lesson"}
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            {paragraphs.length > 0 && paragraphs[0].content ? (
              paragraphs.map((p, idx) => (
                <p key={p.id || idx}>{p.content}</p>
              ))
            ) : (
              <p className="italic text-slate-400">Lesson paragraphs will display here...</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
            <span>{now}</span>
            <CheckCheck size={12} className="text-blue-400" />
          </div>
        </div>

        {/* Quiz Question Bubble if present */}
        {quizQuestion && quizQuestion.question && (
          <div className="bg-[#202c33] rounded-lg p-2.5 max-w-[90%] text-xs shadow-xs space-y-2">
            <div className="text-[11px] font-medium text-amber-300">
              💡 Knowledge Check:
            </div>
            <p className="text-[11px] text-slate-200">{quizQuestion.question}</p>

            {/* Interactive WhatsApp Buttons */}
            <div className="space-y-1 pt-1">
              {quizQuestion.options.map((opt, i) => (
                <div
                  key={i}
                  className="bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] text-emerald-400 rounded-md py-1.5 px-2 text-center text-[10px] font-medium transition-colors cursor-pointer"
                >
                  {opt || `Option ${i + 1}`}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
              <span>{now}</span>
              <CheckCheck size={12} className="text-blue-400" />
            </div>
          </div>
        )}
      </div>

      {/* Simulated Bottom WhatsApp Message Input */}
      <div className="bg-[#202c33] rounded-full px-3 py-1.5 mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>Type a message...</span>
        <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px]">
          ➤
        </div>
      </div>
    </div>
  );
};
