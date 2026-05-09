"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch(console.error);
    }
  }, [status, router]);

  if (status === "loading" || !userData) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <p>BMI: {userData.bmi?.toFixed(1)}</p>
          <p>Experience: {userData.experienceLevel}</p>
          <p>Sports: {userData.sportPreferences?.join(", ")}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your 14-Day Plan</h2>
          <div className="prose max-w-none bg-gray-50 p-4 rounded-md text-sm">
            {userData.trainingPlan ? (
              <ReactMarkdown>{userData.trainingPlan}</ReactMarkdown>
            ) : (
              <p>No plan generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
