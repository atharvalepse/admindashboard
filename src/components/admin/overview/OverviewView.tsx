import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Award,
  MessageSquare,
  ArrowUpRight,
  Plus,
  Workflow,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#25D366", "#0088cc", "#6366f1"];

export const OverviewView: React.FC = () => {
  const { overview, courses, setActiveSection, setSelectedCourseId } = useAdmin();

  if (!overview) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground text-sm">
        Loading overview data...
      </div>
    );
  }

  const { stats, timeline, channelDistribution } = overview;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Total Learners
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Users size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.learners.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp size={13} className="text-emerald-500" />
              <span>{stats.enrollments.toLocaleString()} total enrollments</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Published Courses
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.publishedCourses}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active across WhatsApp & Web
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Completion Rate
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Award size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.certificates.toLocaleString()} verified certificates issued
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Messages Delivered
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.messagesSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.messagesReceived.toLocaleString()} inbound learner replies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Shortcuts Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Quick Actions</h3>
              <p className="text-xs text-muted-foreground">
                Rapidly create educational content or configure automated messaging flows.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedCourseId(null);
                setActiveSection("courses");
              }}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus size={14} />
              New Course
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSection("flows")}
              className="gap-1.5 h-8 text-xs"
            >
              <Workflow size={14} />
              Flow Canvas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSection("chat")}
              className="gap-1.5 h-8 text-xs"
            >
              <MessageSquare size={14} />
              Live Inbox
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visual Charts: Activity Timeline & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Daily Learner Engagement
            </CardTitle>
            <CardDescription className="text-xs">
              Active learners and message exchanges over the past 14 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.slice(5)}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="activeLearners"
                  name="Active Learners"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#activeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Channel Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Learner activity segmented by platform
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={channelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {channelDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="w-full space-y-1.5 mt-2">
              {channelDistribution.map((ch, idx) => (
                <div
                  key={ch.name}
                  className="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">{ch.name}</span>
                  </div>
                  <span className="font-mono">
                    {ch.percentage}% ({ch.count.toLocaleString()})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Overview Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Active Courses
            </CardTitle>
            <CardDescription className="text-xs">
              Overview of deployed micro-courses and enrollment progress
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("courses")}
            className="text-xs gap-1"
          >
            <span>View All</span>
            <ArrowUpRight size={14} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2.5 font-medium">Course Title</th>
                  <th className="py-2.5 font-medium">Delivery</th>
                  <th className="py-2.5 font-medium">Status</th>
                  <th className="py-2.5 font-medium">Modules / Days</th>
                  <th className="py-2.5 font-medium">Learners</th>
                  <th className="py-2.5 font-medium">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-accent/40 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setActiveSection("courses");
                    }}
                  >
                    <td className="py-3 font-semibold text-foreground">
                      {course.title}
                    </td>
                    <td className="py-3">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium">
                        {course.delivery_channel}
                      </span>
                    </td>
                    <td className="py-3">
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
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {course.days.length} days
                    </td>
                    <td className="py-3 font-medium">
                      {course.enrolled.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${course.completion}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {course.completion}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
