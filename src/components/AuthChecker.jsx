import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthChecker() {
  const router = useRouter();

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch("/api/auth", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          router.push("/dashboard");
        }
      }
    }
    checkLogin();
  }, []);

  return null;
}
