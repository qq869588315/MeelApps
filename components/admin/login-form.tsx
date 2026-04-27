"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/dashboard";
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);
    if (!response.ok) {
      setError("邮箱或密码不正确");
      return;
    }
    router.replace(next);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
          M
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">Meel Apps Admin</h1>
        <p className="mt-1 text-sm text-slate-500">登录后管理产品、下载和站点设置。</p>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">邮箱</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          type="email"
          autoComplete="username"
          required
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-medium text-slate-700">密码</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button className="mt-6 w-full" disabled={loading}>
        {loading ? "登录中..." : "登录"}
      </Button>
    </form>
  );
}
