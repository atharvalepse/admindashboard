import React, { useState } from "react";
import type { Course, CourseDay, CourseParagraph } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LessonQuizEditor } from "./LessonQuizEditor";
import { CoursePacingSettings } from "./CoursePacingSettings";
import { WhatsAppPreview } from "./WhatsAppPreview";
import { generateUUID } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

interface CourseEditorProps {
  course: Course;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  course: initialCourse,
  onSave,
  onCancel,
}) => {
  const [course, setCourse] = useState<Course>(JSON.parse(JSON.stringify(initialCourse)));
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const currentDay: CourseDay = course.days[activeDayIndex] || {
    id: generateUUID(),
    title: `Day ${activeDayIndex + 1}`,
    paragraphs: [{ id: generateUUID(), content: "" }],
  };

  const handleAddDay = () => {
    const newDayNum = course.days.length + 1;
    const newDay: CourseDay = {
      id: generateUUID(),
      title: `Day ${newDayNum}: New Topic`,
      paragraphs: [{ id: generateUUID(), content: "" }],
    };
    setCourse({ ...course, days: [...course.days, newDay] });
    setActiveDayIndex(course.days.length);
  };

  const handleRemoveDay = (idx: number) => {
    if (course.days.length <= 1) return;
    const updated = course.days.filter((_, i) => i !== idx);
    setCourse({ ...course, days: updated });
    if (activeDayIndex >= updated.length) {
      setActiveDayIndex(updated.length - 1);
    }
  };

  const handleUpdateCurrentDay = (partialDay: Partial<CourseDay>) => {
    const updatedDays = [...course.days];
    updatedDays[activeDayIndex] = { ...currentDay, ...partialDay };
    setCourse({ ...course, days: updatedDays });
  };

  const handleAddParagraph = () => {
    const updated = [
      ...currentDay.paragraphs,
      { id: generateUUID(), content: "" },
    ];
    handleUpdateCurrentDay({ paragraphs: updated });
  };

  const handleParagraphChange = (pIdx: number, content: string) => {
    const updated = [...currentDay.paragraphs];
    updated[pIdx] = { ...updated[pIdx], content };
    handleUpdateCurrentDay({ paragraphs: updated });
  };

  const handleRemoveParagraph = (pIdx: number) => {
    if (currentDay.paragraphs.length <= 1) return;
    const updated = currentDay.paragraphs.filter((_, i) => i !== pIdx);
    handleUpdateCurrentDay({ paragraphs: updated });
  };

  const handlePublish = () => {
    onSave({ ...course, status: "published" });
  };

  const handleSaveDraft = () => {
    onSave({ ...course, status: "draft" });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
            title="Back to Courses"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {course.title ? course.title : "Untitled Course"}
              </h2>
              <Badge variant={course.status === "published" ? "default" : "secondary"}>
                {course.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery Channel:{" "}
              <span className="font-semibold capitalize text-foreground">
                {course.delivery_channel}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs gap-1.5 h-9"
          >
            <Eye size={14} />
            {showPreview ? "Hide Preview" : "Show Mobile Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs gap-1.5 h-9"
          >
            <Save size={14} />
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            className="text-xs gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send size={14} />
            Publish Course
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Course Form & Content Editor */}
        <div className="flex-1 space-y-6 w-full">
          {/* Metadata Card */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs">Course Title</Label>
                  <Input
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    placeholder="e.g. Financial Literacy for Beginners"
                    className="text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <Input
                    value={course.category || ""}
                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                    placeholder="e.g. Finance"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Delivery Channel</Label>
                  <select
                    value={course.delivery_channel}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        delivery_channel: e.target.value as any,
                      })
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                    <option value="web">Web Portal (/learn)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Short Description</Label>
                <Textarea
                  value={course.description || ""}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Summarize course goals and outcomes..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Module / Day Tabs Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                <h3 className="text-sm font-semibold">Course Modules & Days</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDay}
                className="text-xs gap-1.5 h-8"
              >
                <Plus size={13} />
                Add Day
              </Button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border">
              {course.days.map((day, idx) => (
                <button
                  key={day.id || idx}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeDayIndex === idx
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  <span>{day.title || `Day ${idx + 1}`}</span>
                  {course.days.length > 1 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveDay(idx);
                      }}
                      className="hover:text-destructive p-0.5"
                      title="Remove Day"
                    >
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Day Content Editor Card */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Day / Module Title</Label>
                <Input
                  value={currentDay.title}
                  onChange={(e) =>
                    handleUpdateCurrentDay({ title: e.target.value })
                  }
                  placeholder="e.g. Day 1: Budgeting Foundations"
                  className="text-xs font-medium"
                />
              </div>

              {/* Paragraphs list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Lesson Paragraphs ({currentDay.paragraphs.length})
                  </Label>
                  <button
                    type="button"
                    onClick={handleAddParagraph}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Paragraph
                  </button>
                </div>

                {currentDay.paragraphs.map((para, pIdx) => (
                  <div key={para.id || pIdx} className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground pt-2 font-mono w-4">
                      {pIdx + 1}.
                    </span>
                    <Textarea
                      value={para.content}
                      onChange={(e) => handleParagraphChange(pIdx, e.target.value)}
                      placeholder={`Enter text for message paragraph ${pIdx + 1}...`}
                      rows={2}
                      className="text-xs flex-1"
                    />
                    {currentDay.paragraphs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveParagraph(pIdx)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 mt-1"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Lesson Quiz Component */}
              <LessonQuizEditor
                quiz={currentDay.quiz}
                onChange={(quiz) => handleUpdateCurrentDay({ quiz })}
              />
            </CardContent>
          </Card>

          {/* Course Pacing Settings */}
          <CoursePacingSettings
            pacing={course.pacing}
            onChange={(pacing) => setCourse({ ...course, pacing })}
          />
        </div>

        {/* Live WhatsApp Simulator Phone Screen */}
        {showPreview && (
          <div className="sticky top-6 hidden xl:block">
            <WhatsAppPreview
              courseTitle={course.title}
              dayTitle={currentDay.title}
              paragraphs={currentDay.paragraphs}
              quizQuestion={
                currentDay.quiz
                  ? {
                      question: currentDay.quiz.question,
                      options: currentDay.quiz.options,
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

