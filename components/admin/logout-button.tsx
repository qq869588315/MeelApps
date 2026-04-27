"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }
  return (
    <Button type="button" variant="secondary" onClick={logout}>
      <LogOut className="h-4 w-4" />
      退出登录
    </Button>
  );
}
