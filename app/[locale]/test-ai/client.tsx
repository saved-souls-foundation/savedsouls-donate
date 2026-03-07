"use client";

import { useState } from "react";

const BEARER = "Bearer Golden54321%";
const API_BASE = "";

export default function TestAIClient() {
  const [usageResult, setUsageResult] = useState<string | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);

  const [emailId, setEmailId] = useState("");
  const [emailResult, setEmailResult] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [blogResult, setBlogResult] = useState<string | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);

  const [agendaResult, setAgendaResult] = useState<string | null>(null);
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agendaError, setAgendaError] = useState<string | null>(null);

  const [blogPostId, setBlogPostId] = useState("");
  const [socialResult, setSocialResult] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);

  const [spotlightResult, setSpotlightResult] = useState<string | null>(null);
  const [spotlightLoading, setSpotlightLoading] = useState(false);
  const [spotlightError, setSpotlightError] = useState<string | null>(null);

  const [testAllLoading, setTestAllLoading] = useState(false);
  const [testAllStep, setTestAllStep] = useState(0);

  async function testAll() {
    setTestAllLoading(true);
    setTestAllStep(1);
    await testUsage();
    await new Promise((r) => setTimeout(r, 1000));

    setTestAllStep(2);
    let postIdForSocial = "";
    setBlogLoading(true);
    setBlogError(null);
    setBlogResult(null);
    try {
      const blogRes = await fetch(`${API_BASE}/api/ai/blog-generator`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: BEARER },
        body: "{}",
      });
      const blogData = await blogRes.json();
      setBlogResult(JSON.stringify(blogData, null, 2));
      if (!blogRes.ok) setBlogError(blogData?.error ?? blogRes.statusText);
      const first = blogData?.results?.[0];
      const second = blogData?.results?.[1];
      postIdForSocial = first?.post_id ?? second?.post_id ?? "";
    } catch (e) {
      setBlogError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBlogLoading(false);
    }
    await new Promise((r) => setTimeout(r, 1000));

    setTestAllStep(3);
    await testAgendaReminder();
    await new Promise((r) => setTimeout(r, 1000));

    setTestAllStep(4);
    await testTestSpotlight();
    await new Promise((r) => setTimeout(r, 1000));

    setTestAllStep(5);
    setSocialLoading(true);
    setSocialError(null);
    setSocialResult(null);
    try {
      const socialRes = await fetch(`${API_BASE}/api/ai/social-generator`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: BEARER },
        body: JSON.stringify({ blogPostId: postIdForSocial || blogPostId.trim() }),
      });
      const socialData = await socialRes.json();
      setSocialResult(JSON.stringify(socialData, null, 2));
      if (!socialRes.ok) setSocialError(socialData?.error ?? socialRes.statusText);
    } catch (e) {
      setSocialError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSocialLoading(false);
    }

    setTestAllLoading(false);
    setTestAllStep(0);
  }

  async function testUsage() {
    setUsageLoading(true);
    setUsageError(null);
    setUsageResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/usage`, {
        method: "GET",
        headers: { Authorization: BEARER },
      });
      const data = await res.json();
      setUsageResult(JSON.stringify(data, null, 2));
      if (!res.ok) setUsageError(data?.error ?? res.statusText);
    } catch (e) {
      setUsageError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setUsageLoading(false);
    }
  }

  async function testEmailProcessor() {
    setEmailLoading(true);
    setEmailError(null);
    setEmailResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/email-processor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER,
        },
        body: JSON.stringify({ emailId: emailId.trim() }),
      });
      const data = await res.json();
      setEmailResult(JSON.stringify(data, null, 2));
      if (!res.ok) setEmailError(data?.error ?? res.statusText);
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setEmailLoading(false);
    }
  }

  async function testBlogGenerator() {
    setBlogLoading(true);
    setBlogError(null);
    setBlogResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/blog-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER,
        },
        body: "{}",
      });
      const data = await res.json();
      setBlogResult(JSON.stringify(data, null, 2));
      if (!res.ok) setBlogError(data?.error ?? res.statusText);
    } catch (e) {
      setBlogError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBlogLoading(false);
    }
  }

  async function testAgendaReminder() {
    setAgendaLoading(true);
    setAgendaError(null);
    setAgendaResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/agenda-reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER,
        },
        body: "{}",
      });
      const data = await res.json();
      setAgendaResult(JSON.stringify(data, null, 2));
      if (!res.ok) setAgendaError(data?.error ?? res.statusText);
    } catch (e) {
      setAgendaError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setAgendaLoading(false);
    }
  }

  async function testSocialGenerator() {
    setSocialLoading(true);
    setSocialError(null);
    setSocialResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/social-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER,
        },
        body: JSON.stringify({ blogPostId: blogPostId.trim() }),
      });
      const data = await res.json();
      setSocialResult(JSON.stringify(data, null, 2));
      if (!res.ok) setSocialError(data?.error ?? res.statusText);
    } catch (e) {
      setSocialError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSocialLoading(false);
    }
  }

  async function testTestSpotlight() {
    setSpotlightLoading(true);
    setSpotlightError(null);
    setSpotlightResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/test-spotlight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER,
        },
        body: "{}",
      });
      const data = await res.json();
      setSpotlightResult(JSON.stringify(data, null, 2));
      if (!res.ok) setSpotlightError(data?.error ?? res.statusText);
    } catch (e) {
      setSpotlightError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSpotlightLoading(false);
    }
  }

  async function testStopSpotlight() {
    setSpotlightLoading(true);
    setSpotlightError(null);
    setSpotlightResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/test-spotlight/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER,
        },
        body: "{}",
      });
      const data = await res.json();
      setSpotlightResult(JSON.stringify(data, null, 2));
      if (!res.ok) setSpotlightError(data?.error ?? res.statusText);
    } catch (e) {
      setSpotlightError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSpotlightLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="text-2xl font-bold text-stone-800 mb-2">Test AI (lokaal)</div>
      <div className="text-sm text-stone-500 mb-8">Alleen voor lokaal testen. Niet voor productie.</div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={testAll}
          disabled={testAllLoading}
          className="px-4 py-2 rounded-lg bg-stone-700 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
        >
          🚀 Test Alles
        </button>
        {testAllLoading && (
          <span className="text-sm text-stone-600">Tests draaien... ({testAllStep}/5)</span>
        )}
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* 1. AI Usage */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="text-lg font-semibold text-stone-800 mb-3">Test AI Usage</div>
          <button
            type="button"
            onClick={testUsage}
            disabled={usageLoading}
            className="px-4 py-2 rounded-lg bg-stone-700 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
          >
            {usageLoading ? "Laden..." : "Test"}
          </button>
          {usageError && <div className="mt-3 text-sm text-red-600">{usageError}</div>}
          {usageResult && (
            <pre
              className={`mt-3 p-4 rounded-lg border text-xs overflow-x-auto ${usageError ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}
            >
              {usageResult}
            </pre>
          )}
        </section>

        {/* 2. Email Processor */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="text-lg font-semibold text-stone-800 mb-3">Test Email Processor</div>
          <div className="flex gap-2 items-center mb-3">
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="emailId (UUID)"
              className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
            <button
              type="button"
              onClick={testEmailProcessor}
              disabled={emailLoading}
              className="px-4 py-2 rounded-lg bg-stone-700 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
            >
              {emailLoading ? "Laden..." : "Test"}
            </button>
          </div>
          {emailError && <div className="text-sm text-red-600">{emailError}</div>}
          {emailResult && (
            <pre
              className={`mt-3 p-4 rounded-lg border text-xs overflow-x-auto ${emailError ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}
            >
              {emailResult}
            </pre>
          )}
        </section>

        {/* 3. Blog Generator */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="text-lg font-semibold text-stone-800 mb-3">Test Blog Generator</div>
          <button
            type="button"
            onClick={testBlogGenerator}
            disabled={blogLoading}
            className="px-4 py-2 rounded-lg bg-stone-700 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
          >
            {blogLoading ? "Laden..." : "Test"}
          </button>
          {blogError && <div className="mt-3 text-sm text-red-600">{blogError}</div>}
          {blogResult && (
            <pre
              className={`mt-3 p-4 rounded-lg border text-xs overflow-x-auto ${blogError ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}
            >
              {blogResult}
            </pre>
          )}
        </section>

        {/* 4. Agenda Reminder */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="text-lg font-semibold text-stone-800 mb-3">Test Agenda Reminder</div>
          <button
            type="button"
            onClick={testAgendaReminder}
            disabled={agendaLoading}
            className="px-4 py-2 rounded-lg bg-stone-700 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
          >
            {agendaLoading ? "Laden..." : "Test"}
          </button>
          {agendaError && <div className="mt-3 text-sm text-red-600">{agendaError}</div>}
          {agendaResult && (
            <pre
              className={`mt-3 p-4 rounded-lg border text-xs overflow-x-auto ${agendaError ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}
            >
              {agendaResult}
            </pre>
          )}
        </section>

        {/* 5. Social Generator */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="text-lg font-semibold text-stone-800 mb-3">Test Social Generator</div>
          <div className="flex gap-2 items-center mb-3">
            <input
              type="text"
              value={blogPostId}
              onChange={(e) => setBlogPostId(e.target.value)}
              placeholder="blogPostId (UUID)"
              className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
            <button
              type="button"
              onClick={testSocialGenerator}
              disabled={socialLoading}
              className="px-4 py-2 rounded-lg bg-stone-700 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
            >
              {socialLoading ? "Laden..." : "Test"}
            </button>
          </div>
          {socialError && <div className="text-sm text-red-600">{socialError}</div>}
          {socialResult && (
            <pre
              className={`mt-3 p-4 rounded-lg border text-xs overflow-x-auto ${socialError ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}
            >
              {socialResult}
            </pre>
          )}
        </section>

        {/* 6. Test Spotlight (30min test) */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="text-lg font-semibold text-stone-800 mb-3">Test Spotlight (30min test)</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={testTestSpotlight}
              disabled={spotlightLoading}
              className="px-4 py-2 rounded-lg bg-stone-700 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
            >
              {spotlightLoading ? "Laden..." : "Test"}
            </button>
            <button
              type="button"
              onClick={testStopSpotlight}
              disabled={spotlightLoading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {spotlightLoading ? "Laden..." : "Stop 24h test"}
            </button>
          </div>
          {spotlightError && <div className="mt-3 text-sm text-red-600">{spotlightError}</div>}
          {spotlightResult && (
            <pre
              className={`mt-3 p-4 rounded-lg border text-xs overflow-x-auto ${spotlightError ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}
            >
              {spotlightResult}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
