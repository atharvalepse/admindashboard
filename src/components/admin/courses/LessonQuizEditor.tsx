import React from "react";
import type { CourseQuiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { generateUUID } from "@/lib/utils";

interface LessonQuizEditorProps {
  quiz?: CourseQuiz;
  onChange: (quiz?: CourseQuiz) => void;
}

export const LessonQuizEditor: React.FC<LessonQuizEditorProps> = ({
  quiz,
  onChange,
}) => {
  const isEnabled = Boolean(quiz);

  const handleToggle = () => {
    if (isEnabled) {
      onChange(undefined);
    } else {
      onChange({
        id: generateUUID(),
        question: "",
        options: ["", ""],
        correctAnswer: "",
        explanation: "",
      });
    }
  };

  if (!isEnabled || !quiz) {
    return (
      <div className="border border-dashed border-border rounded-xl p-4 text-center bg-card">
        <p className="text-xs text-muted-foreground mb-2">
          No quiz question attached to this lesson module.
        </p>
        <Button variant="outline" size="sm" onClick={handleToggle} className="text-xs gap-1.5">
          <Plus size={14} />
          Add Quiz Question
        </Button>
      </div>
    );
  }

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...quiz.options];
    const prev = updated[idx];
    updated[idx] = val;
    let correct = quiz.correctAnswer;
    if (correct === prev) {
      correct = val;
    }
    onChange({ ...quiz, options: updated, correctAnswer: correct });
  };

  const handleAddOption = () => {
    if (quiz.options.length >= 4) return;
    onChange({ ...quiz, options: [...quiz.options, ""] });
  };

  const handleRemoveOption = (idx: number) => {
    if (quiz.options.length <= 2) return;
    const removedVal = quiz.options[idx];
    const updated = quiz.options.filter((_, i) => i !== idx);
    let correct = quiz.correctAnswer;
    if (correct === removedVal) {
      correct = updated[0] || "";
    }
    onChange({ ...quiz, options: updated, correctAnswer: correct });
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-primary" />
          <h4 className="text-sm font-semibold">Lesson Quiz Question</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="text-xs text-destructive hover:bg-destructive/10 h-7"
        >
          Remove Quiz
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Question Prompt</Label>
        <Input
          placeholder="e.g. Under the 50/30/20 rule, how much is saved?"
          value={quiz.question}
          onChange={(e) => onChange({ ...quiz, question: e.target.value })}
          className="text-xs"
        />
      </div>

      {/* Answer Options */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Answer Choices (Select correct answer)</Label>
          {quiz.options.length < 4 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Add Choice
            </button>
          )}
        </div>

        <div className="space-y-2">
          {quiz.options.map((option, idx) => {
            const isCorrect = quiz.correctAnswer === option && option.length > 0;
            return (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct_answer"
                  checked={isCorrect}
                  onChange={() => onChange({ ...quiz, correctAnswer: option })}
                  className="accent-primary h-4 w-4 shrink-0 cursor-pointer"
                  title="Mark as correct answer"
                  disabled={!option.trim()}
                />
                <Input
                  placeholder={`Choice ${idx + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="text-xs flex-1"
                />
                {quiz.options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(idx)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-1.5">
        <Label className="text-xs">Explanation / Feedback</Label>
        <Textarea
          placeholder="Explain why this answer is correct. This is shown to learners right after they submit."
          value={quiz.explanation || ""}
          onChange={(e) => onChange({ ...quiz, explanation: e.target.value })}
          rows={2}
          className="text-xs"
        />
      </div>
    </div>
  );
};

