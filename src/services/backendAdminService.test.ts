import test from "node:test";
import assert from "node:assert/strict";
import { BackendAdminService } from "./backendAdminService";
import { apiClient } from "./apiClient";
import type { Course } from "../types";

test("BackendAdminService maps Ekatra courses, lessons and quizzes correctly", async () => {
  const service = new BackendAdminService();
  const originalFetch = global.fetch;

  const mockCourses = [
    {
      id: 1,
      orgId: 1,
      slug: "climate-101",
      title: "Climate 101",
      description: "Basics of climate science",
      status: "published",
      lessonCount: 1,
      createdAt: "2026-11-01T10:00:00Z",
      updatedAt: "2026-11-01T10:00:00Z",
      lessons: [
        {
          id: 10,
          courseId: 1,
          position: 1,
          title: "Introduction to Greenhouse Gases",
          items: [
            { kind: "text", text: "Carbon dioxide traps heat in the atmosphere." },
            {
              kind: "quiz",
              text: "Which gas is a major greenhouse gas?",
              explanation: "CO2 is the primary human-emitted greenhouse gas.",
              options: [
                { label: "Carbon Dioxide", correct: true },
                { label: "Oxygen", correct: false },
                { label: "Argon", correct: false },
              ],
            },
          ],
        },
      ],
    },
  ];

  global.fetch = async (url: any) => {
    const urlStr = String(url);
    if (urlStr.includes("/admin/courses/1/schedule")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          schedule: { kind: "daily", dailyTime: "08:30", timezone: "Asia/Kolkata" },
        }),
      } as any;
    }
    if (urlStr.includes("/admin/courses/1")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ course: mockCourses[0] }),
      } as any;
    }
    if (urlStr.includes("/admin/courses")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ courses: mockCourses }),
      } as any;
    }
    return { ok: false, status: 404 } as any;
  };

  try {
    const courses = await service.listCourses();
    assert.equal(courses.length, 1);
    const c = courses[0]!;
    assert.equal(c.id, "1");
    assert.equal(c.title, "Climate 101");
    assert.equal(c.status, "published");
    assert.equal(c.days.length, 1);
    assert.equal(c.days[0]!.title, "Introduction to Greenhouse Gases");
    assert.equal(c.days[0]!.paragraphs[0]!.content, "Carbon dioxide traps heat in the atmosphere.");
    assert.ok(c.days[0]!.quiz);
    assert.equal(c.days[0]!.quiz?.question, "Which gas is a major greenhouse gas?");
    assert.equal(c.days[0]!.quiz?.correctAnswer, "Carbon Dioxide");
    assert.equal(c.pacing?.mode, "fixed_time");
    assert.equal(c.pacing?.unlockTime, "08:30");
  } finally {
    global.fetch = originalFetch;
  }
});

test("BackendAdminService computes Overview KPIs accurately", async () => {
  const service = new BackendAdminService();
  const originalFetch = global.fetch;

  global.fetch = async (url: any) => {
    const s = String(url);
    if (s.includes("/admin/courses")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          courses: [{ id: 1, status: "published" }, { id: 2, status: "draft" }],
        }),
      } as any;
    }
    if (s.includes("/admin/learners")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          learners: [{ id: 101, phone: "+911234567890", optedOut: false }],
          total: 25,
        }),
      } as any;
    }
    if (s.includes("/admin/enrollments")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          enrollments: [
            { id: 1, status: "completed" },
            { id: 2, status: "active" },
          ],
          total: 10,
        }),
      } as any;
    }
    if (s.includes("/admin/certificates")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          certificates: [{ id: 1, code: "CERT-123" }],
          total: 5,
        }),
      } as any;
    }
    if (s.includes("/admin/delivery")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          messages: [{ id: 1, status: "delivered", createdAt: "2026-11-16T12:00:00Z" }],
          total: 42,
        }),
      } as any;
    }
    return { ok: false, status: 404 } as any;
  };

  try {
    const overview = await service.getOverview();
    assert.equal(overview.stats.publishedCourses, 1);
    assert.equal(overview.stats.learners, 25);
    assert.equal(overview.stats.enrollments, 10);
    assert.equal(overview.stats.certificates, 5);
    assert.equal(overview.stats.messagesSent, 42);
    assert.ok(overview.timeline.length > 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test("BackendAdminService handles course creation with lessons and quizzes", async () => {
  const service = new BackendAdminService();
  const originalFetch = global.fetch;

  let createdCoursePayload: any = null;
  let schedulePayload: any = null;
  let publishCalled = false;

  const newCourseToSave: Course = {
    id: "new-course-id",
    title: "Financial Literacy for Farmers",
    description: "Budgeting and crop credit fundamentals",
    status: "published",
    delivery_channel: "whatsapp",
    enrolled: 0,
    completion: 0,
    created: "2026-11-16",
    days: [
      {
        id: "day-1",
        title: "Day 1: Savings Accounts",
        paragraphs: [{ id: "p1", content: "Always maintain an emergency savings fund." }],
        quiz: {
          id: "q1",
          question: "Where should emergency funds be kept?",
          options: ["Under a mattress", "In a bank account", "Invested in volatile assets"],
          correctAnswer: "In a bank account",
          explanation: "Bank accounts are secure and insured.",
        },
      },
    ],
    pacing: {
      mode: "fixed_time",
      gapDays: 1,
      unlockTime: "07:30",
      timezone: "Asia/Kolkata",
    },
  };

  global.fetch = async (url: any, init?: any) => {
    const urlStr = String(url);
    if (urlStr.endsWith("/admin/courses") && init?.method === "POST") {
      createdCoursePayload = JSON.parse(init.body);
      return {
        ok: true,
        status: 201,
        json: async () => ({
          course: {
            id: 99,
            title: createdCoursePayload.title,
            description: createdCoursePayload.description,
            status: "draft",
            lessons: [
              {
                id: 101,
                courseId: 99,
                position: 1,
                title: createdCoursePayload.lessons[0].title,
                items: createdCoursePayload.lessons[0].items,
              },
            ],
          },
        }),
      } as any;
    }
    if (urlStr.includes("/admin/courses/99/publish")) {
      publishCalled = true;
      return { ok: true, status: 200, json: async () => ({}) } as any;
    }
    if (urlStr.includes("/admin/courses/99/schedule")) {
      if (init?.method === "PUT") {
        schedulePayload = JSON.parse(init.body);
        return { ok: true, status: 200, json: async () => ({}) } as any;
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          schedule: {
            dailyTime: schedulePayload?.dailyTime || "07:30",
            timezone: "Asia/Kolkata",
            kind: "daily",
          },
        }),
      } as any;
    }
    if (urlStr.includes("/admin/courses/99")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          course: {
            id: 99,
            title: newCourseToSave.title,
            description: newCourseToSave.description,
            status: "published",
            lessons: [
              {
                id: 101,
                courseId: 99,
                position: 1,
                title: "Day 1: Savings Accounts",
                items: [
                  { kind: "text", text: "Always maintain an emergency savings fund." },
                  {
                    kind: "quiz",
                    text: "Where should emergency funds be kept?",
                    explanation: "Bank accounts are secure and insured.",
                    options: [
                      { label: "Under a mattress", correct: false },
                      { label: "In a bank account", correct: true },
                      { label: "Invested in volatile assets", correct: false },
                    ],
                  },
                ],
              },
            ],
          },
        }),
      } as any;
    }
    return { ok: false, status: 404 } as any;
  };

  try {
    const saved = await service.saveCourse(newCourseToSave);
    assert.equal(saved.id, "99");
    assert.equal(createdCoursePayload.title, "Financial Literacy for Farmers");
    assert.equal(createdCoursePayload.lessons.length, 1);
    assert.equal(createdCoursePayload.lessons[0].items[1].kind, "quiz");
    assert.equal(publishCalled, true);
    assert.equal(schedulePayload.dailyTime, "07:30");
    assert.equal(saved.days[0]?.quiz?.correctAnswer, "In a bank account");
  } finally {
    global.fetch = originalFetch;
  }
});

test("BackendAdminService lists chats with 24-hour reply window status", async () => {
  const service = new BackendAdminService();
  const originalFetch = global.fetch;

  global.fetch = async (url: any) => {
    const s = String(url);
    if (s.includes("/admin/learners")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          learners: [
            {
              id: 1,
              name: "Pooja Sharma",
              phone: "whatsapp:+919876543210",
              course: "Climate 101",
              progress: 2,
              status: "active",
              optedOut: false,
            },
          ],
        }),
      } as any;
    }
    if (s.includes("/admin/delivery")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          messages: [
            {
              id: 50,
              learnerId: 1,
              status: "delivered",
              kind: "reply",
              createdAt: new Date(Date.now() - 3600_000).toISOString(), // 1 hour ago
            },
          ],
        }),
      } as any;
    }
    if (s.includes("/admin/failures")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ failures: [] }),
      } as any;
    }
    return { ok: false, status: 404 } as any;
  };

  try {
    const chats = await service.listChats();
    assert.equal(chats.length, 1);
    const chat = chats[0]!;
    assert.equal(chat.contact_name, "Pooja Sharma");
    assert.equal(chat.phone_number, "whatsapp:+919876543210");
    assert.equal(chat.reply_window_open, true);
    assert.equal(chat.needs_attention, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("BackendAdminService handles user creation", async () => {
  const service = new BackendAdminService();
  const originalFetch = global.fetch;

  global.fetch = async (url: any, init?: any) => {
    const s = String(url);
    if (s.includes("/admin/users") && init?.method === "POST") {
      const body = JSON.parse(init.body);
      return {
        ok: true,
        status: 201,
        json: async () => ({
          user: {
            id: 12,
            name: body.name,
            role: body.role,
            createdAt: "2026-11-16T12:00:00Z",
          },
          apiKey: "ek_live_secret12345678",
        }),
      } as any;
    }
    return { ok: false, status: 404 } as any;
  };

  try {
    const newUser = await service.inviteUser("trainer@ekatra.org", "Vikram Patel", "instructor");
    assert.equal(newUser.id, "12");
    assert.equal(newUser.full_name, "Vikram Patel");
    assert.equal(newUser.role, "instructor");
  } finally {
    global.fetch = originalFetch;
  }
});

test("BackendAdminService handles certificates listing and sending", async () => {
  const service = new BackendAdminService();
  const originalFetch = global.fetch;

  let resendCalledWithId: number | null = null;

  global.fetch = async (url: any, init?: any) => {
    const s = String(url);
    if (s.endsWith("/admin/certificates")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          certificates: [
            {
              id: 42,
              code: "10-HMAC1234567890AB",
              learnerName: "Rohan Verma",
              courseTitle: "Demo Course",
              issuedAt: "2026-11-16T15:30:00Z",
              enrollmentId: 10,
            },
          ],
        }),
      } as any;
    }
    if (s.includes("/admin/certificates/10/resend") && init?.method === "POST") {
      resendCalledWithId = 10;
      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, messageId: 999 }),
      } as any;
    }
    return { ok: false, status: 404 } as any;
  };

  try {
    const certs = await service.listCertificates();
    assert.equal(certs.length, 1);
    const cert = certs[0]!;
    assert.equal(cert.learnerName, "Rohan Verma");
    assert.equal(cert.code, "10-HMAC1234567890AB");
    assert.ok(cert.pdfUrl?.includes("10-HMAC1234567890AB.pdf"));

    const result = await service.sendCertificate(10);
    assert.equal(result.ok, true);
    assert.equal(result.messageId, 999);
    assert.equal(resendCalledWithId, 10);
  } finally {
    global.fetch = originalFetch;
  }
});

