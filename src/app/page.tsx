"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.hasCompletedOnboarding) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-24 text-gray-900">
      <h1 className="text-6xl font-bold text-indigo-600 mb-8">Kreeda</h1>
      <p className="text-xl mb-12 text-center max-w-2xl text-gray-600">
        Your AI-Powered Sports Training Platform. Personalized plans, GPS tracking, and community connection.
      </p>

      <button
        onClick={() => signIn("google")}
        className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 transition shadow-lg"
      >
        Sign in with Google to Start Your Journey
      </button>
    </main>
  );
}
