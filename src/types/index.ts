export type DeliveryChannel = "whatsapp" | "telegram" | "web";
export type CourseStatus = "draft" | "published" | "archived";
export type PacingMode = "immediate" | "fixed_time" | "after_completion";

export interface CourseParagraph {
  id: string;
  content: string;
}

export interface CourseQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
}

export interface CourseDay {
  id: string;
  title: string;
  paragraphs: CourseParagraph[];
  quiz?: CourseQuiz;
}

export interface CoursePacing {
  mode: PacingMode;
  gapDays: number;
  unlockTime: string;
  timezone: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  language?: string;
  price?: number;
  status: CourseStatus;
  delivery_channel: DeliveryChannel;
  enrolled: number;
  completion: number;
  created: string;
  days: CourseDay[];
  pacing?: CoursePacing;
}

export type FlowKind =
  | "keyword"
  | "fallback"
  | "course_start"
  | "course_complete"
  | "broadcast";

export type FlowNodeType =
  | "trigger"
  | "message"
  | "ask"
  | "condition"
  | "action"
  | "delay"
  | "template";

export interface FlowNodeOption {
  id: string;
  title: string;
}

export interface FlowNodeData {
  title?: string;
  text?: string;
  buttons?: FlowNodeOption[];
  list?: {
    button: string;
    rows: Array<FlowNodeOption & { description?: string }>;
  };
  variable?: string;
  validate?: "text" | "number" | "email" | "phone" | "one_of";
  choices?: string[];
  retryText?: string;
  maxAttempts?: number;
  actionType?: "enroll" | "tag" | "handoff" | "start_course";
  actionPayload?: string;
  delayMinutes?: number;
  templateName?: string;
  templateParams?: string[];
  conditionRules?: Array<{
    source: "variable" | "enrollment";
    variable?: string;
    op: string;
    value?: string;
  }>;
  [key: string]: unknown;
}

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: FlowNodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
}

export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface Flow {
  id: string;
  name: string;
  kind: FlowKind;
  isActive: boolean;
  courseId?: string | null;
  graph: FlowGraph;
  responsesCount: number;
  updatedAt: string;
  keywords?: string[];
}

export type PlatformType = "whatsapp" | "telegram";

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: "learner" | "agent" | "system";
  content: string;
  sent_at: string;
  status?: "sent" | "delivered" | "read" | "failed";
  template_name?: string | null;
}

export interface ChatConversation {
  id: string;
  platform: PlatformType;
  phone_number?: string;
  chat_id?: string;
  contact_name: string;
  last_message: string;
  last_interaction_at: string;
  needs_attention: boolean;
  attention_reason?: string | null;
  attention_at?: string | null;
  unread_count: number;
  reply_window_open: boolean;
  messages: ChatMessage[];
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  body: string;
  buttons?: string[];
}

export interface WhatsAppSettings {
  waba_id: string;
  phone_number: string;
  auto_reply_enabled: boolean;
  cooldown_minutes: number;
  waiting_message: string;
}

export interface TelegramSettings {
  bot_username: string;
  is_connected: boolean;
  webhook_url: string;
}

export interface DashboardStats {
  learners: number;
  enrollments: number;
  publishedCourses: number;
  completionRate: number;
  certificates: number;
  messagesSent: number;
  messagesReceived: number;
}

export interface DailyActivity {
  date: string;
  activeLearners: number;
  messagesSent: number;
  messagesReceived: number;
  completions: number;
}

export interface ChannelBreakdown {
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  timeline: DailyActivity[];
  channelDistribution: ChannelBreakdown[];
}

export type UserRole = "admin" | "instructor" | "learner";
export type UserStatus = "active" | "suspended";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login_at: string;
}

export interface Certificate {
  id: number;
  code: string;
  learnerName: string;
  courseTitle: string;
  issuedAt: string;
  enrollmentId: number;
  pdfUrl?: string;
  previewUrl?: string;
}

export type AdminSectionId =
  | "overview"
  | "courses"
  | "certificates"
  | "flows"
  | "chat"
  | "analytics"
  | "whatsapp"
  | "telegram"
  | "users"
  | "settings";

