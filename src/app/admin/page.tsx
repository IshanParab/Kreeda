"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Competition {
  _id: string;
  title: string;
  sport: string;
  location: string;
  eventDate: string;
  description?: string;
  sourceLink?: string;
}

const INITIAL_FORM = {
  title: "",
  description: "",
  sport: "",
  location: "",
  eventDate: "",
  sourceLink: "",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCompetitions = useCallback(async () => {
    const response = await fetch("/api/admin/competitions");
    if (response.status === 403) {
      router.push("/dashboard");
      return;
    }
    const data = await response.json();
    setCompetitions(data.competitions || []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      if (!session?.user?.isAdmin) {
        router.push("/dashboard");
        return;
      }
      void loadCompetitions();
    }
  }, [status, session, router, loadCompetitions]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/admin/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (!response.ok) return;
    setForm(INITIAL_FORM);
    void loadCompetitions();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/competitions?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) return;
    setCompetitions((prev) => prev.filter((competition) => competition._id !== id));
  };

  if (loading || status === "loading") {
    return <div className="p-8">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-indigo-600">Admin Dashboard</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 grid gap-4 md:grid-cols-2"
        >
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="border rounded px-3 py-2"
            placeholder="Competition title"
          />
          <input
            required
            value={form.sport}
            onChange={(e) => setForm((prev) => ({ ...prev, sport: e.target.value }))}
            className="border rounded px-3 py-2"
            placeholder="Sport"
          />
          <input
            required
            value={form.location}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, location: e.target.value }))
            }
            className="border rounded px-3 py-2"
            placeholder="Location"
          />
          <input
            required
            type="date"
            value={form.eventDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, eventDate: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
          <input
            value={form.sourceLink}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, sourceLink: e.target.value }))
            }
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Source URL (optional)"
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Description (optional)"
            rows={3}
          />
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 bg-indigo-600 text-white rounded px-4 py-2 disabled:bg-indigo-300"
          >
            {saving ? "Saving..." : "Add Competition"}
          </button>
        </form>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Competitions</h2>
          <div className="space-y-4">
            {competitions.length === 0 ? (
              <p>No competitions added yet.</p>
            ) : (
              competitions.map((competition) => (
                <div
                  key={competition._id}
                  className="border rounded p-4 flex justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold">{competition.title}</h3>
                    <p className="text-sm text-gray-600">
                      {competition.sport} • {competition.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(competition.eventDate).toLocaleDateString()}
                    </p>
                    {competition.description ? (
                      <p className="text-sm mt-2">{competition.description}</p>
                    ) : null}
                  </div>
                  <button
                    onClick={() => handleDelete(competition._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
