import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://127.0.0.1:5173";
const API_KEY = "ek_live_JQ-m5awO_H9tPx5PW4KWOuL0lXRRTzDJmINX_hDy_xA";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

test("Live E2E: Session and org info", async () => {
  const res = await fetch(`${BASE_URL}/admin/session`, { headers });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.role, "org_admin");
  assert.equal(data.name, "Demo Administrator");
  assert.equal(data.orgSlug, "demo");
});

test("Live E2E: Courses API", async () => {
  const res = await fetch(`${BASE_URL}/admin/courses`, { headers });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.courses));
  assert.ok(data.courses.length >= 1);
  assert.equal(data.courses[0].slug, "demo-course");
});

test("Live E2E: Certificate generation, retrieval, PDF and resend", async () => {
  // Use a unique phone for each test run to avoid resend cooldown conflicts
  const testPhone = `+9198765${Date.now().toString().slice(-6)}`;

  // 1. Issue certificate directly
  const issueRes = await fetch(`${BASE_URL}/admin/certificates`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      phone: testPhone,
      courseId: 1,
      learnerName: "Integration Test User",
      sendNow: true,
    }),
  });
  assert.equal(issueRes.status, 201);
  const issueData = await issueRes.json();
  assert.equal(issueData.ok, true);
  assert.ok(issueData.certificate);
  assert.equal(issueData.certificate.learnerName, "Integration Test User");
  assert.ok(issueData.certificate.code);

  const certCode = issueData.certificate.code;
  const enrollmentId = issueData.certificate.enrollmentId;

  // 2. List certificates includes the new cert
  const listRes = await fetch(`${BASE_URL}/admin/certificates`, { headers });
  assert.equal(listRes.status, 200);
  const listData = await listRes.json();
  assert.ok(Array.isArray(listData.certificates));
  const found = listData.certificates.find((c: any) => c.code === certCode);
  assert.ok(found, `Certificate ${certCode} should be in the list`);
  assert.equal(found.learnerName, "Integration Test User");

  // 3. Public HTML certificate route
  const htmlRes = await fetch(`${BASE_URL}/certificates/${certCode}`);
  assert.equal(htmlRes.status, 200);
  const htmlText = await htmlRes.text();
  assert.ok(htmlText.includes("Certificate of Completion"));
  assert.ok(htmlText.includes("Integration Test User"));

  // 4. Public PDF certificate route
  const pdfRes = await fetch(`${BASE_URL}/certificates/${certCode}.pdf`);
  assert.equal(pdfRes.status, 200);
  assert.equal(pdfRes.headers.get("content-type"), "application/pdf");

  // 5. Resend to WhatsApp
  const resendRes = await fetch(`${BASE_URL}/admin/certificates/${enrollmentId}/resend`, {
    method: "POST",
    headers,
  });
  assert.equal(resendRes.status, 200);
  const resendData = await resendRes.json();
  assert.equal(resendData.ok, true);
  assert.ok(resendData.messageId);

  // 6. Resend cooldown protection
  const doubleResendRes = await fetch(`${BASE_URL}/admin/certificates/${enrollmentId}/resend`, {
    method: "POST",
    headers,
  });
  assert.equal(doubleResendRes.status, 409);
});

