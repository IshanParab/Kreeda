"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const { status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    bodyType: "",
    experienceLevel: "",
    sportPreferences: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to complete onboarding");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSportToggle = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      sportPreferences: prev.sportPreferences.includes(sport)
        ? prev.sportPreferences.filter((s) => s !== sport)
        : [...prev.sportPreferences, sport],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Kreeda
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let&apos;s personalize your journey. Step {step} of 5
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-gray-900">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Stats</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Body Type</h3>
              <div className="space-y-2">
                {["Ectomorph", "Mesomorph", "Endomorph"].map((type) => (
                  <label key={type} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="bodyType"
                      value={type}
                      checked={formData.bodyType === type}
                      onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span className="text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Experience Level</h3>
              <div className="space-y-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <label key={level} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level}
                      checked={formData.experienceLevel === level}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span className="text-gray-900">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Sport Preferences</h3>
              <div className="space-y-2">
                {["Running", "Cycling", "Badminton", "Table Tennis", "Walking"].map((sport) => (
                  <label key={sport} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.sportPreferences.includes(sport)}
                      onChange={() => handleSportToggle(sport)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="text-gray-900">{sport}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Ready to Generate Your Plan</h3>
              <p className="text-sm text-gray-600">
                We&apos;ll use our AI coach to generate a personalized 14-day training plan based on your stats.
              </p>
              {formData.height && formData.weight && (
                <p className="mt-4 font-medium text-indigo-600">
                  Estimated BMI: { (parseFloat(formData.weight) / Math.pow(parseFloat(formData.height)/100, 2)).toFixed(1) }
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={handleNext}
                className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? "Generating..." : "Generate Plan"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
