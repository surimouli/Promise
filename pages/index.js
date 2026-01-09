import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div style={{ maxWidth: 860, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
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
          <PromiseApp />
        </SignedIn>
      </main>
    </div>
  );
}

function PromiseApp() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function refresh() {
    setLoading(true);
    const r = await fetch("/api/promise");
    const j = await r.json();
    setActive(j.active ?? null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createPromise(e) {
    e.preventDefault();
    const r = await fetch("/api/promise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const j = await r.json();
    if (!r.ok) {
      const msg = j?.error?.formErrors?.[0] || "Could not create promise";
      alert(msg);
      return;
    }

    setTitle("");
    setDescription("");
    await refresh();
  }

  if (loading) return <p>Loading…</p>;

  if (!active) {
    return (
      <div style={{ marginTop: 18 }}>
        <h2 style={{ marginBottom: 10 }}>Create your first Promise</h2>

        <form onSubmit={createPromise} style={{ display: "grid", gap: 12 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Promise title (e.g., Finish my SOP draft)"
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              fontSize: 16,
            }}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional: a little context (kept private)"
            rows={4}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              fontSize: 16,
              resize: "vertical",
            }}
          />

          <button
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Create Promise
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
      <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div>
            <h2 style={{ margin: 0 }}>{active.title}</h2>
            {active.description ? (
              <p style={{ marginTop: 8, color: "#444", whiteSpace: "pre-wrap" }}>{active.description}</p>
            ) : (
              <p style={{ marginTop: 8, color: "#777" }}>No description.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 16 }}>
        <h3 style={{ marginTop: 0 }}>Next step</h3>
        <p style={{ marginBottom: 0, color: "#444" }}>
          Now we’ll add chat so you can talk to PROMISE and store messages securely.
        </p>
      </div>
    </div>
  );
}