import { useEffect, useState } from "react";

import { getAdminSession } from "@/features/tretnix/live.functions";
import { setAdminCsrfToken } from "./admin-session";

export type AdminSession = {
  status: "loading" | "signed-out" | "admin";
  userId: string | null;
  email: string | null;
};

export function useAdminSession(): AdminSession {
  const [session, setSession] = useState<AdminSession>({
    status: "loading",
    userId: null,
    email: null,
  });

  useEffect(() => {
    let alive = true;
    void getAdminSession()
      .then((nextSession) => {
        if (!alive) return;
        if (nextSession.authenticated) {
          setAdminCsrfToken(nextSession.csrfToken);
          setSession({
            status: "admin",
            userId: nextSession.userId,
            email: nextSession.email,
          });
        } else {
          setAdminCsrfToken(null);
          setSession({ status: "signed-out", userId: null, email: null });
        }
      })
      .catch(() => {
        if (!alive) return;
        setAdminCsrfToken(null);
        setSession({ status: "signed-out", userId: null, email: null });
      });

    return () => {
      alive = false;
    };
  }, []);

  return session;
}
