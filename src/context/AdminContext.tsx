import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  Course,
  DashboardSummary,
  Flow,
  ChatConversation,
  WhatsAppTemplate,
  WhatsAppSettings,
  TelegramSettings,
  User,
  Certificate,
  AdminSectionId,
} from "@/types";
import { type IAdminService, defaultAdminService } from "@/services/adminService";

interface AdminContextValue {
  service: IAdminService;
  activeSection: AdminSectionId;
  setActiveSection: (section: AdminSectionId) => void;
  
  // Data
  overview: DashboardSummary | null;
  courses: Course[];
  flows: Flow[];
  chats: ChatConversation[];
  templates: WhatsAppTemplate[];
  users: User[];
  certificates: Certificate[];
  whatsappSettings: WhatsAppSettings | null;
  telegramSettings: TelegramSettings | null;
  
  // Loading & Error States
  loading: boolean;
  refreshData: () => Promise<void>;

  // Selection states for sub-views / detail views
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedFlowId: string | null;
  setSelectedFlowId: (id: string | null) => void;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;

  // Actions
  saveCourse: (course: Course) => Promise<Course>;
  duplicateCourse: (id: string) => Promise<Course>;
  deleteCourse: (id: string) => Promise<boolean>;
  saveFlow: (flow: Flow) => Promise<Flow>;
  toggleFlowActive: (id: string, active: boolean) => Promise<void>;
  sendMessage: (chatId: string, content: string, template?: string) => Promise<void>;
  resolveAttention: (chatId: string) => Promise<void>;
  inviteUser: (email: string, name: string, role: any) => Promise<void>;
  sendCertificate: (enrollmentId: number) => Promise<void>;
  generateCertificate: (data: {
    phone: string;
    courseId: number;
    learnerName: string;
    sendNow?: boolean;
  }) => Promise<Certificate>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export interface AdminProviderProps {
  children: React.ReactNode;
  service?: IAdminService;
  initialSection?: AdminSectionId;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({
  children,
  service = defaultAdminService,
  initialSection = "overview",
}) => {
  const [activeSection, setActiveSection] = useState<AdminSectionId>(initialSection);
  const [overview, setOverview] = useState<DashboardSummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings | null>(null);
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, cs, fl, ch, tpl, us, wa, tg, certs] = await Promise.all([
        service.getOverview(),
        service.listCourses(),
        service.listFlows(),
        service.listChats(),
        service.listTemplates(),
        service.listUsers(),
        service.getWhatsAppSettings(),
        service.getTelegramSettings(),
        service.listCertificates().catch(() => []),
      ]);
      setOverview(ov);
      setCourses(cs);
      setFlows(fl);
      setChats(ch);
      setTemplates(tpl);
      setUsers(us);
      setWhatsappSettings(wa);
      setTelegramSettings(tg);
      setCertificates(certs);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const saveCourse = async (course: Course) => {
    const saved = await service.saveCourse(course);
    await refreshData();
    return saved;
  };

  const duplicateCourse = async (id: string) => {
    const copy = await service.duplicateCourse(id);
    await refreshData();
    return copy;
  };

  const deleteCourse = async (id: string) => {
    const ok = await service.deleteCourse(id);
    if (ok) await refreshData();
    return ok;
  };

  const saveFlow = async (flow: Flow) => {
    const saved = await service.saveFlow(flow);
    await refreshData();
    return saved;
  };

  const toggleFlowActive = async (id: string, active: boolean) => {
    await service.toggleFlowActive(id, active);
    await refreshData();
  };

  const sendMessage = async (chatId: string, content: string, template?: string) => {
    await service.sendChatMessage(chatId, content, template);
    const updatedChats = await service.listChats();
    setChats(updatedChats);
  };

  const resolveAttention = async (chatId: string) => {
    await service.resolveChatAttention(chatId);
    const updatedChats = await service.listChats();
    setChats(updatedChats);
  };

  const inviteUser = async (email: string, name: string, role: any) => {
    await service.inviteUser(email, name, role);
    const updatedUsers = await service.listUsers();
    setUsers(updatedUsers);
  };

  const sendCertificate = async (enrollmentId: number) => {
    await service.sendCertificate(enrollmentId);
    const updatedCerts = await service.listCertificates();
    setCertificates(updatedCerts);
  };

  const generateCertificate = async (data: {
    phone: string;
    courseId: number;
    learnerName: string;
    sendNow?: boolean;
  }) => {
    const cert = await service.generateCertificate(data);
    const updatedCerts = await service.listCertificates();
    setCertificates(updatedCerts);
    return cert;
  };

  return (
    <AdminContext.Provider
      value={{
        service,
        activeSection,
        setActiveSection,
        overview,
        courses,
        flows,
        chats,
        templates,
        users,
        certificates,
        whatsappSettings,
        telegramSettings,
        loading,
        refreshData,
        selectedCourseId,
        setSelectedCourseId,
        selectedFlowId,
        setSelectedFlowId,
        selectedChatId,
        setSelectedChatId,
        saveCourse,
        duplicateCourse,
        deleteCourse,
        saveFlow,
        toggleFlowActive,
        sendMessage,
        resolveAttention,
        inviteUser,
        sendCertificate,
        generateCertificate,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

