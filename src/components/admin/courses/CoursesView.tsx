import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { Course, CourseStatus, DeliveryChannel } from "@/types";
import { CourseEditor } from "./CourseEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateUUID } from "@/lib/utils";
import {
  Search,
  Plus,
  BookOpen,
  Copy,
  Trash2,
  Edit3,
  Users,
  Award,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export const CoursesView: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    saveCourse,
    duplicateCourse,
    deleteCourse,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CourseStatus>("all");
  const [channelFilter, setChannelFilter] = useState<"all" | DeliveryChannel>("all");
  const [isCreating, setIsCreating] = useState(false);

  // If a course is selected for editing or creating, show CourseEditor
  const activeCourse = isCreating
    ? {
        id: generateUUID(),
        title: "",
        description: "",
        category: "General",
        language: "English",
        price: 0,
        status: "draft" as CourseStatus,
        delivery_channel: "whatsapp" as DeliveryChannel,
        enrolled: 0,
        completion: 0,
        created: new Date().toISOString().split("T")[0],
        days: [
          {
            id: generateUUID(),
            title: "Day 1",
            paragraphs: [{ id: generateUUID(), content: "" }],
          },
        ],
      }
    : courses.find((c) => c.id === selectedCourseId);

  if (activeCourse) {
    return (
      <CourseEditor
        course={activeCourse}
        onSave={async (updated) => {
          await saveCourse(updated);
          setIsCreating(false);
          setSelectedCourseId(null);
        }}
        onCancel={() => {
          setIsCreating(false);
          setSelectedCourseId(null);
        }}
      />
    );
  }

  // Filter courses
  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchChannel = channelFilter === "all" || c.delivery_channel === channelFilter;
    return matchSearch && matchStatus && matchChannel;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md relative">
          <Search size={15} className="absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Search courses by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2 h-9 text-xs font-semibold shrink-0"
        >
          <Plus size={15} />
          Create Course
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-1">
          {(["all", "published", "draft", "archived"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Channel:</span>
          {(["all", "whatsapp", "telegram", "web"] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                channelFilter === ch
                  ? "bg-secondary text-secondary-foreground font-bold"
                  : "hover:text-foreground"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card">
          <BookOpen size={36} className="mx-auto text-muted-foreground mb-3 opacity-40" />
          <h3 className="font-semibold text-sm">No courses found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {search
              ? "No courses matched your current filter criteria."
              : "Get started by creating your first bite-sized learning course."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col justify-between hover:border-primary/50 transition-all shadow-xs group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-secondary text-secondary-foreground">
                    {course.delivery_channel}
                  </span>
                  <Badge
                    variant={
                      course.status === "published"
                        ? "default"
                        : course.status === "draft"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-[10px] capitalize"
                  >
                    {course.status}
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {course.description || "No description provided."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-border text-center text-xs">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">
                      Days
                    </div>
                    <div className="font-semibold mt-0.5">{course.days.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">
                      Learners
                    </div>
                    <div className="font-semibold mt-0.5">
                      {course.enrolled.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">
                      Completion
                    </div>
                    <div className="font-semibold mt-0.5">{course.completion}%</div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCourseId(course.id)}
                    className="gap-1.5 h-8 text-xs flex-1 mr-2"
                  >
                    <Edit3 size={13} />
                    Edit Content
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => duplicateCourse(course.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Duplicate Course"
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCourse(course.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Delete Course"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
