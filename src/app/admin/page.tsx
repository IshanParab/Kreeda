"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Hardcoded admin emails for MVP purposes
const ADMIN_EMAILS = ["ishanparab@gmail.com", "ishanparab2002@gmail.com"]; // User should update this

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
          // If you want to bypass admin check locally, uncomment below or add your google email
          // router.push("/dashboard");
      }

      fetch("/api/admin/competitions")
        .then((res) => res.json())
        .then((data) => {
            if (data.competitions) setCompetitions(data.competitions);
            setLoading(false);
        })
        .catch(console.error);
    }
  }, [status, router, session]);

  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          const res = await fetch(`/api/admin/competitions/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
          });
          if (res.ok) {
              setCompetitions(competitions.map(c => c._id === id ? { ...c, status: newStatus } : c));
          }
      } catch(e) {
          console.error(e);
      }
  };

  const handleDelete = async (id: string) => {
      try {
          const res = await fetch(`/api/admin/competitions/${id}`, { method: 'DELETE' });
          if (res.ok) {
              setCompetitions(competitions.filter(c => c._id !== id));
          }
      } catch(e) {
          console.error(e);
      }
  };

  if (loading) return <div className="p-8">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-600">Admin Dashboard</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Competitions Management</h2>
              <button
                  onClick={() => fetch('/api/cron/scrape').then(()=>alert('Scrape triggered!'))}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
              >
                  Trigger Scraper & AI
              </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport/Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitions.map((comp) => (
                  <tr key={comp._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{comp.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{comp.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{comp.sport}</div>
                        <div className="text-sm text-gray-500">{comp.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comp.isAiGenerated ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {comp.isAiGenerated ? 'AI Extracted' : 'Manual'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${comp.status === 'approved' ? 'bg-green-100 text-green-800' :
                          comp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {comp.status !== 'approved' && (
                            <button onClick={() => handleStatusChange(comp._id, 'approved')} className="text-green-600 hover:text-green-900">Approve</button>
                        )}
                        {comp.status !== 'rejected' && (
                            <button onClick={() => handleStatusChange(comp._id, 'rejected')} className="text-orange-600 hover:text-orange-900">Reject</button>
                        )}
                        <button onClick={() => handleDelete(comp._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {competitions.length === 0 && <div className="p-4 text-center text-gray-500">No competitions found. Trigger scraper or add manually.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
