import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminSession = {
  status: "loading" | "signed-out" | "not-admin" | "admin";
  userId: string | null;
  email: string | null;
};

export function useAdminSession(): AdminSession {
  const [s, setS] = useState<AdminSession>({ status: "loading", userId: null, email: null });

  useEffect(() => {
    let alive = true;

    async function check() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!alive) return;
      if (!user) {
        setS({ status: "signed-out", userId: null, email: null });
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!alive) return;
      setS({
        status: roleRow ? "admin" : "not-admin",
        userId: user.id,
        email: user.email ?? null,
      });
    }

    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void check();
      }
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return s;
}
