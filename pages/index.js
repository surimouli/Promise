import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>PROMISE</h1>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <main style={{ marginTop: 24 }}>
        <SignedOut>
          <p style={{ fontSize: 18 }}>
            The AI that helps you keep the promises you make to yourself.
          </p>
          <p style={{ color: "#444" }}>Sign in to create your first Promise.</p>
        </SignedOut>

        <SignedIn>
          <MePanel />
        </SignedIn>
      </main>
    </div>
  );
}

function MePanel() {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      try {
        const r = await fetch("/api/me");
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load user");
        setUser(j.user);
        setStatus("ready");
      } catch (e) {
        setError(e.message || "Unknown error");
        setStatus("error");
      }
    }
    run();
  }, []);

  if (status === "loading") return <p>Connecting your account…</p>;
  if (status === "error") return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <div style={{ marginTop: 12, padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
      <p style={{ margin: 0, fontSize: 18 }}>Connected ✅</p>
      <p style={{ marginTop: 8, color: "#444" }}>
        Your internal user id: <code>{user.id}</code>
      </p>
      <p style={{ marginTop: 8, color: "#444" }}>
        Next step: create your first Promise and start chatting.
      </p>
    </div>
  );
}