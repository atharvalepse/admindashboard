import type {
  Course,
  DashboardSummary,
  Flow,
  ChatConversation,
  WhatsAppTemplate,
  WhatsAppSettings,
  TelegramSettings,
  User,
} from "@/types";

export const mockDashboardSummary: DashboardSummary = {
  stats: {
    learners: 1420,
    enrollments: 2850,
    publishedCourses: 12,
    completionRate: 78,
    certificates: 940,
    messagesSent: 28450,
    messagesReceived: 21300,
  },
  timeline: Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const iso = d.toISOString().split("T")[0];
    return {
      date: iso,
      activeLearners: 120 + Math.floor(Math.sin(i) * 30) + i * 8,
      messagesSent: 850 + Math.floor(Math.random() * 200),
      messagesReceived: 620 + Math.floor(Math.random() * 150),
      completions: 25 + Math.floor(Math.random() * 15),
    };
  }),
  channelDistribution: [
    { name: "WhatsApp", count: 2052, percentage: 72 },
    { name: "Telegram", count: 513, percentage: 18 },
    { name: "Web (/learn)", count: 285, percentage: 10 },
  ],
};

export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Financial Literacy for Beginners",
    description:
      "A 3-day micro-course covering budgeting basics, emergency savings, and simple investments.",
    category: "Finance",
    language: "English",
    price: 0,
    status: "published",
    delivery_channel: "whatsapp",
    enrolled: 1240,
    completion: 82,
    created: "2026-10-15",
    pacing: {
      mode: "fixed_time",
      gapDays: 1,
      unlockTime: "09:00",
      timezone: "Asia/Kolkata",
    },
    days: [
      {
        id: "day-1",
        title: "Day 1: Foundations of Budgeting",
        paragraphs: [
          {
            id: "p-1-1",
            content:
              "Welcome to Day 1! Budgeting is simply giving every rupee a job before the month starts.",
          },
          {
            id: "p-1-2",
            content:
              "The 50/30/20 rule is a great starting blueprint: 50% for Needs, 30% for Wants, and 20% for Savings.",
          },
        ],
        quiz: {
          id: "quiz-1",
          question: "Under the 50/30/20 rule, what percentage is recommended for savings & debt repayment?",
          options: ["10%", "20%", "30%", "50%"],
          correctAnswer: "20%",
          explanation: "20% goes towards emergency funds, retirement, and accelerated debt payoff.",
        },
      },
      {
        id: "day-2",
        title: "Day 2: Building an Emergency Fund",
        paragraphs: [
          {
            id: "p-2-1",
            content:
              "An emergency fund shields you from life's unexpected surprises like medical expenses or car repairs.",
          },
          {
            id: "p-2-2",
            content:
              "Aim to build an initial buffer of ₹10,000, then expand it to cover 3 to 6 months of living expenses.",
          },
        ],
        quiz: {
          id: "quiz-2",
          question: "How many months of essential living expenses should a mature emergency fund cover?",
          options: ["1 month", "3 to 6 months", "12 to 24 months"],
          correctAnswer: "3 to 6 months",
          explanation: "3 to 6 months provides stability without keeping excessive cash idle against inflation.",
        },
      },
      {
        id: "day-3",
        title: "Day 3: Introduction to Index Investing",
        paragraphs: [
          {
            id: "p-3-1",
            content:
              "Investing helps your money grow faster than inflation through compound interest.",
          },
          {
            id: "p-3-2",
            content:
              "Index funds offer low-cost, diversified exposure to top national companies.",
          },
        ],
        quiz: {
          id: "quiz-3",
          question: "What is the primary benefit of low-cost broad index funds?",
          options: [
            "Guaranteed 50% return in 1 year",
            "Automatic instant diversification and low fees",
            "No market fluctuations ever",
          ],
          correctAnswer: "Automatic instant diversification and low fees",
          explanation: "Index funds bundle hundreds of top companies, reducing single-stock risks cheaply.",
        },
      },
    ],
  },
  {
    id: "course-2",
    title: "Digital Marketing Fundamentals",
    description: "Learn SEO basics, social media strategy, and email automation in bite-sized modules.",
    category: "Marketing",
    language: "English",
    price: 0,
    status: "published",
    delivery_channel: "web",
    enrolled: 820,
    completion: 64,
    created: "2026-10-28",
    days: [
      {
        id: "m-1",
        title: "Module 1: SEO Basics",
        paragraphs: [
          {
            id: "mp-1",
            content: "Search Engine Optimization connects searchers with your valuable content organically.",
          },
        ],
        quiz: {
          id: "mq-1",
          question: "Which of the following describes on-page SEO?",
          options: ["Optimizing site content and HTML tags", "Purchasing sponsored Google Ads", "Buying backlinks"],
          correctAnswer: "Optimizing site content and HTML tags",
          explanation: "On-page SEO refers to changes made directly on your own website pages.",
        },
      },
    ],
  },
  {
    id: "course-3",
    title: "Cybersecurity Hygiene for Remote Teams",
    description: "Essential habits to protect credentials, identify phishing, and safeguard company data.",
    category: "IT & Security",
    language: "English",
    price: 0,
    status: "draft",
    delivery_channel: "whatsapp",
    enrolled: 0,
    completion: 0,
    created: "2026-11-10",
    days: [
      {
        id: "sec-1",
        title: "Day 1: Phishing & Suspicious Links",
        paragraphs: [
          {
            id: "sec-p1",
            content: "Phishing emails often mimic known services like Google, Slack, or Microsoft.",
          },
        ],
      },
    ],
  },
];

export const mockFlows: Flow[] = [
  {
    id: "flow-1",
    name: "New Learner Onboarding",
    kind: "keyword",
    isActive: true,
    keywords: ["start", "join", "hello"],
    responsesCount: 412,
    updatedAt: "2026-11-12T14:30:00Z",
    graph: {
      nodes: [
        {
          id: "node-trigger",
          type: "trigger",
          position: { x: 50, y: 150 },
          data: { title: "Keyword Trigger ('start', 'join')" },
        },
        {
          id: "node-msg-welcome",
          type: "message",
          position: { x: 300, y: 150 },
          data: {
            title: "Welcome Greeting",
            text: "Hello! Welcome to Ekatra MicroLearn. We are excited to have you join our learning community!",
            buttons: [
              { id: "opt_proceed", title: "Let's Begin" },
              { id: "opt_more_info", title: "Learn More" },
            ],
          },
        },
        {
          id: "node-ask-name",
          type: "ask",
          position: { x: 600, y: 120 },
          data: {
            title: "Ask Learner Name",
            text: "What is your full name? (This will appear on your completion certificates)",
            variable: "learner_name",
            validate: "text",
            maxAttempts: 3,
            retryText: "Please reply with your name to proceed.",
          },
        },
        {
          id: "node-action-enroll",
          type: "action",
          position: { x: 900, y: 150 },
          data: {
            title: "Enroll in Financial Literacy",
            actionType: "enroll",
            actionPayload: "course-1",
          },
        },
      ],
      edges: [
        {
          id: "e-1",
          source: "node-trigger",
          target: "node-msg-welcome",
        },
        {
          id: "e-2",
          source: "node-msg-welcome",
          target: "node-ask-name",
          sourceHandle: "opt_proceed",
        },
        {
          id: "e-3",
          source: "node-ask-name",
          target: "node-action-enroll",
        },
      ],
    },
  },
  {
    id: "flow-2",
    name: "Help & Fallback Menu",
    kind: "fallback",
    isActive: true,
    responsesCount: 189,
    updatedAt: "2026-11-14T09:15:00Z",
    graph: {
      nodes: [
        {
          id: "f2-trigger",
          type: "trigger",
          position: { x: 50, y: 150 },
          data: { title: "Unrecognized Inbound Message" },
        },
        {
          id: "f2-msg",
          type: "message",
          position: { x: 300, y: 150 },
          data: {
            title: "Help Options",
            text: "I didn't quite catch that. How can I help you today?",
            buttons: [
              { id: "help_courses", title: "My Courses" },
              { id: "help_human", title: "Talk to a Person" },
            ],
          },
        },
      ],
      edges: [{ id: "f2-e1", source: "f2-trigger", target: "f2-msg" }],
    },
  },
];

export const mockChats: ChatConversation[] = [
  {
    id: "chat-1",
    platform: "whatsapp",
    phone_number: "+919766072308",
    contact_name: "Rajesh Kumar",
    last_message: "Can someone help me understand why question 2 was marked incorrect?",
    last_interaction_at: "2026-11-16T18:45:00Z",
    needs_attention: true,
    attention_reason: "Requested human support",
    attention_at: "2026-11-16T18:45:00Z",
    unread_count: 1,
    reply_window_open: true,
    messages: [
      {
        id: "m-1",
        conversation_id: "chat-1",
        sender: "learner",
        content: "Hi, I am taking Day 1 of Financial Literacy.",
        sent_at: "2026-11-16T18:30:00Z",
        status: "read",
      },
      {
        id: "m-2",
        conversation_id: "chat-1",
        sender: "agent",
        content:
          "Welcome Rajesh! Click 'Next' when you are ready to read your first lesson.",
        sent_at: "2026-11-16T18:30:10Z",
        status: "delivered",
      },
      {
        id: "m-3",
        conversation_id: "chat-1",
        sender: "learner",
        content: "Can someone help me understand why question 2 was marked incorrect?",
        sent_at: "2026-11-16T18:45:00Z",
        status: "read",
      },
    ],
  },
  {
    id: "chat-2",
    platform: "whatsapp",
    phone_number: "+919822334455",
    contact_name: "Priya Sharma",
    last_message: "Awesome, thank you! Excited for Day 2.",
    last_interaction_at: "2026-11-16T17:10:00Z",
    needs_attention: false,
    unread_count: 0,
    reply_window_open: true,
    messages: [
      {
        id: "m-4",
        conversation_id: "chat-2",
        sender: "learner",
        content: "20%",
        sent_at: "2026-11-16T17:08:00Z",
        status: "read",
      },
      {
        id: "m-5",
        conversation_id: "chat-2",
        sender: "agent",
        content: "Correct! 🎉 20% goes towards savings and debt payoff.",
        sent_at: "2026-11-16T17:08:15Z",
        status: "read",
      },
      {
        id: "m-6",
        conversation_id: "chat-2",
        sender: "learner",
        content: "Awesome, thank you! Excited for Day 2.",
        sent_at: "2026-11-16T17:10:00Z",
        status: "read",
      },
    ],
  },
  {
    id: "chat-3",
    platform: "telegram",
    chat_id: "tg_998124",
    contact_name: "Alex Mercer (@alexm)",
    last_message: "Next lesson please",
    last_interaction_at: "2026-11-15T11:20:00Z",
    needs_attention: false,
    unread_count: 0,
    reply_window_open: false,
    messages: [
      {
        id: "m-7",
        conversation_id: "chat-3",
        sender: "learner",
        content: "Next lesson please",
        sent_at: "2026-11-15T11:20:00Z",
      },
      {
        id: "m-8",
        conversation_id: "chat-3",
        sender: "agent",
        content: "Here is your next lesson on SEO meta tags.",
        sent_at: "2026-11-15T11:20:10Z",
      },
    ],
  },
];

export const mockTemplates: WhatsAppTemplate[] = [
  {
    id: "tpl-1",
    name: "course_welcome",
    language: "en",
    status: "APPROVED",
    category: "UTILITY",
    body: "We are grateful to have you join our course! Click the button below to start your learning journey.",
    buttons: ["Start Course"],
  },
  {
    id: "tpl-2",
    name: "daily_lesson_nudge",
    language: "en",
    status: "APPROVED",
    category: "UTILITY",
    body: "Hi {{1}}, Day {{2}} of '{{3}}' is ready for you! Take 3 minutes to learn today's lesson.",
    buttons: ["Continue Learning"],
  },
  {
    id: "tpl-3",
    name: "certificate_issued",
    language: "en",
    status: "APPROVED",
    category: "UTILITY",
    body: "Congratulations {{1}}! You have completed {{2}}. Here is your verified certificate code: {{3}}.",
    buttons: ["View Certificate"],
  },
];

export const mockUsers: User[] = [
  {
    id: "u-1",
    email: "a@ekatra.one",
    full_name: "Aarav Sharma",
    role: "admin",
    status: "active",
    created_at: "2026-09-01T10:00:00Z",
    last_login_at: "2026-11-16T18:00:00Z",
  },
  {
    id: "u-2",
    email: "meera@ekatra.one",
    full_name: "Meera Patel",
    role: "instructor",
    status: "active",
    created_at: "2026-09-15T12:00:00Z",
    last_login_at: "2026-11-16T15:20:00Z",
  },
  {
    id: "u-3",
    email: "rajesh.k@gmail.com",
    full_name: "Rajesh Kumar",
    role: "learner",
    status: "active",
    created_at: "2026-10-10T08:30:00Z",
    last_login_at: "2026-11-16T18:45:00Z",
  },
  {
    id: "u-4",
    email: "priya.s@yahoo.com",
    full_name: "Priya Sharma",
    role: "learner",
    status: "active",
    created_at: "2026-10-18T14:15:00Z",
    last_login_at: "2026-11-16T17:10:00Z",
  },
];

export const mockWhatsAppSettings: WhatsAppSettings = {
  waba_id: "waba_991823102",
  phone_number: "+1 659-277-2030",
  auto_reply_enabled: true,
  cooldown_minutes: 120,
  waiting_message:
    "A team member has been notified and will reply shortly. Thanks for your patience!",
};

export const mockTelegramSettings: TelegramSettings = {
  bot_username: "@VEFTestBot",
  is_connected: true,
  webhook_url: "https://api.ekatra.one/telegram/webhook",
};

