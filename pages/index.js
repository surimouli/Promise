import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

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
          <p style={{ color: "#444" }}>
            Sign in to create your first Promise.
          </p>
        </SignedOut>

        <SignedIn>
          <p style={{ fontSize: 18 }}>
            You’re signed in ✅
          </p>
          <p style={{ color: "#444" }}>
            Next step: we’ll connect your account to the database and create your first Promise.
          </p>
        </SignedIn>
      </main>
    </div>
  );
}