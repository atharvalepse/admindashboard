import type {
  Course,
  DashboardSummary,
  Flow,
  ChatConversation,
  ChatMessage,
  WhatsAppTemplate,
  WhatsAppSettings,
  TelegramSettings,
  User,
  UserRole,
  UserStatus,
} from "@/types";
import {
  mockCourses,
  mockDashboardSummary,
  mockFlows,
  mockChats,
  mockTemplates,
  mockUsers,
  mockWhatsAppSettings,
  mockTelegramSettings,
} from "@/mock";
import { generateUUID } from "@/lib/utils";

export interface IAdminService {
  getOverview(): Promise<DashboardSummary>;
  
  // Courses
  listCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | null>;
  saveCourse(course: Course): Promise<Course>;
  duplicateCourse(id: string): Promise<Course>;
  deleteCourse(id: string): Promise<boolean>;

  // Flows
  listFlows(): Promise<Flow[]>;
  getFlow(id: string): Promise<Flow | null>;
  saveFlow(flow: Flow): Promise<Flow>;
  toggleFlowActive(id: string, active: boolean): Promise<Flow>;

  // Chat History
  listChats(): Promise<ChatConversation[]>;
  getChat(id: string): Promise<ChatConversation | null>;
  sendChatMessage(conversationId: string, content: string, templateName?: string): Promise<ChatMessage>;
  resolveChatAttention(conversationId: string): Promise<boolean>;

  // Messaging & Templates
  listTemplates(): Promise<WhatsAppTemplate[]>;
  submitTemplate(template: Omit<WhatsAppTemplate, "id" | "status">): Promise<WhatsAppTemplate>;
  getWhatsAppSettings(): Promise<WhatsAppSettings>;
  saveWhatsAppSettings(settings: Partial<WhatsAppSettings>): Promise<WhatsAppSettings>;
  getTelegramSettings(): Promise<TelegramSettings>;
  saveTelegramSettings(settings: Partial<TelegramSettings>): Promise<TelegramSettings>;

  // Users
  listUsers(): Promise<User[]>;
  inviteUser(email: string, full_name: string, role: UserRole): Promise<User>;
  updateUserRole(id: string, role: UserRole): Promise<User>;
  updateUserStatus(id: string, status: UserStatus): Promise<User>;
}

export class MockAdminService implements IAdminService {
  private courses: Course[] = JSON.parse(JSON.stringify(mockCourses));
  private flows: Flow[] = JSON.parse(JSON.stringify(mockFlows));
  private chats: ChatConversation[] = JSON.parse(JSON.stringify(mockChats));
  private templates: WhatsAppTemplate[] = JSON.parse(JSON.stringify(mockTemplates));
  private users: User[] = JSON.parse(JSON.stringify(mockUsers));
  private whatsappSettings: WhatsAppSettings = { ...mockWhatsAppSettings };
  private telegramSettings: TelegramSettings = { ...mockTelegramSettings };

  async getOverview(): Promise<DashboardSummary> {
    return JSON.parse(JSON.stringify(mockDashboardSummary));
  }

  async listCourses(): Promise<Course[]> {
    return [...this.courses];
  }

  async getCourse(id: string): Promise<Course | null> {
    const found = this.courses.find((c) => c.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async saveCourse(course: Course): Promise<Course> {
    const idx = this.courses.findIndex((c) => c.id === course.id);
    if (idx >= 0) {
      this.courses[idx] = { ...course };
    } else {
      const newCourse = {
        ...course,
        id: course.id || generateUUID(),
        created: new Date().toISOString().split("T")[0],
      };
      this.courses.unshift(newCourse);
      return newCourse;
    }
    return course;
  }

  async duplicateCourse(id: string): Promise<Course> {
    const source = this.courses.find((c) => c.id === id);
    if (!source) throw new Error("Course not found");
    const copy: Course = {
      ...JSON.parse(JSON.stringify(source)),
      id: generateUUID(),
      title: `${source.title} (Copy)`,
      status: "draft",
      enrolled: 0,
      completion: 0,
      created: new Date().toISOString().split("T")[0],
    };
    this.courses.unshift(copy);
    return copy;
  }

  async deleteCourse(id: string): Promise<boolean> {
    const prev = this.courses.length;
    this.courses = this.courses.filter((c) => c.id !== id);
    return this.courses.length < prev;
  }

  async listFlows(): Promise<Flow[]> {
    return [...this.flows];
  }

  async getFlow(id: string): Promise<Flow | null> {
    const found = this.flows.find((f) => f.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async saveFlow(flow: Flow): Promise<Flow> {
    const idx = this.flows.findIndex((f) => f.id === flow.id);
    const updated: Flow = {
      ...flow,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      this.flows[idx] = updated;
    } else {
      this.flows.unshift(updated);
    }
    return updated;
  }

  async toggleFlowActive(id: string, active: boolean): Promise<Flow> {
    const flow = this.flows.find((f) => f.id === id);
    if (!flow) throw new Error("Flow not found");
    flow.isActive = active;
    flow.updatedAt = new Date().toISOString();
    return { ...flow };
  }

  async listChats(): Promise<ChatConversation[]> {
    return [...this.chats];
  }

  async getChat(id: string): Promise<ChatConversation | null> {
    const chat = this.chats.find((c) => c.id === id);
    return chat ? JSON.parse(JSON.stringify(chat)) : null;
  }

  async sendChatMessage(
    conversationId: string,
    content: string,
    templateName?: string
  ): Promise<ChatMessage> {
    const chat = this.chats.find((c) => c.id === conversationId);
    if (!chat) throw new Error("Conversation not found");

    const message: ChatMessage = {
      id: `msg-${generateUUID()}`,
      conversation_id: conversationId,
      sender: "agent",
      content,
      sent_at: new Date().toISOString(),
      status: "delivered",
      template_name: templateName,
    };

    chat.messages.push(message);
    chat.last_message = content;
    chat.last_interaction_at = message.sent_at;
    return message;
  }

  async resolveChatAttention(conversationId: string): Promise<boolean> {
    const chat = this.chats.find((c) => c.id === conversationId);
    if (!chat) return false;
    chat.needs_attention = false;
    chat.attention_reason = null;
    chat.attention_at = null;
    return true;
  }

  async listTemplates(): Promise<WhatsAppTemplate[]> {
    return [...this.templates];
  }

  async submitTemplate(
    template: Omit<WhatsAppTemplate, "id" | "status">
  ): Promise<WhatsAppTemplate> {
    const created: WhatsAppTemplate = {
      ...template,
      id: `tpl-${generateUUID().slice(0, 8)}`,
      status: "APPROVED",
    };
    this.templates.unshift(created);
    return created;
  }

  async getWhatsAppSettings(): Promise<WhatsAppSettings> {
    return { ...this.whatsappSettings };
  }

  async saveWhatsAppSettings(
    settings: Partial<WhatsAppSettings>
  ): Promise<WhatsAppSettings> {
    this.whatsappSettings = { ...this.whatsappSettings, ...settings };
    return { ...this.whatsappSettings };
  }

  async getTelegramSettings(): Promise<TelegramSettings> {
    return { ...this.telegramSettings };
  }

  async saveTelegramSettings(
    settings: Partial<TelegramSettings>
  ): Promise<TelegramSettings> {
    this.telegramSettings = { ...this.telegramSettings, ...settings };
    return { ...this.telegramSettings };
  }

  async listUsers(): Promise<User[]> {
    return [...this.users];
  }

  async inviteUser(email: string, full_name: string, role: UserRole): Promise<User> {
    const newUser: User = {
      id: `u-${generateUUID().slice(0, 8)}`,
      email,
      full_name,
      role,
      status: "active",
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    user.role = role;
    return { ...user };
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    user.status = status;
    return { ...user };
  }
}

import { backendAdminService } from "./backendAdminService";

export { BackendAdminService } from "./backendAdminService";
export const defaultAdminService = backendAdminService;


