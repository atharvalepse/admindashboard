import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, Award, MessageSquare, ArrowUpRight } from "lucide-react";

const CHANNEL_COLORS = ["#25D366", "#0088cc", "#6366f1"];

export const AnalyticsView: React.FC = () => {
  const { overview } = useAdmin();
  const [timeRange, setTimeRange] = useState<"14d" | "30d">("14d");

  if (!overview) return null;
  const { stats, timeline, channelDistribution } = overview;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Platform Analytics</h2>
          <p className="text-xs text-muted-foreground">
            In-depth analytics on learner progression, messaging velocity, and channel distribution
          </p>
        </div>

        <div className="flex items-center gap-1 border border-border p-1 rounded-lg bg-card self-start">
          <button
            onClick={() => setTimeRange("14d")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              timeRange === "14d"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 14 Days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              timeRange === "30d"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Course Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificates}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp size={13} />
              <span>{stats.completionRate}% completion rate</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Message Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.4%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.messagesSent.toLocaleString()} sent without drops
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Inbound Reply Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.messagesReceived / stats.messagesSent) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              High interactive learner engagement
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Avg. Time to Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Across 3-day micro-courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learner Activity & Completions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Active Learners & Completions
            </CardTitle>
            <CardDescription className="text-xs">
              Daily active students vs course completions
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="activeLearners"
                  name="Active Learners"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  name="Completions"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Messaging Traffic Velocity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Messaging Traffic Velocity
            </CardTitle>
            <CardDescription className="text-xs">
              Outbound lesson pushes vs inbound student answers
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
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
                <Legend />
                <Bar
                  dataKey="messagesSent"
                  name="Sent Lessons"
                  fill="#25D366"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="messagesReceived"
                  name="Learner Inbound"
                  fill="#0088cc"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

