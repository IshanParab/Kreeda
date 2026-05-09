"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SchemesAndVerification() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleDigiLockerMock = () => {
    setVerifying(true);
    // Simulate API call and verification process
    setTimeout(() => {
      setIsVerified(true);
      setVerifying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-600">Schemes & Verification</h1>

        {/* Identity Verification Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">DigiLocker Verification</h2>
            {isVerified ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                Verified
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Pending
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-6">
            Verify your identity and age officially via DigiLocker to participate in national schemes and verified events.
          </p>
          {!isVerified && (
            <button
              onClick={handleDigiLockerMock}
              disabled={verifying}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {verifying ? (
                <>
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Connecting to DigiLocker...
                </>
              ) : (
                "Connect with DigiLocker"
              )}
            </button>
          )}
        </div>

        {/* Schemes Links Section */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Government Schemes</h2>
          <p className="text-gray-600 mb-6">
            Explore and apply for sports initiatives available in your region.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
                href="https://kheloindia.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition group relative"
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">Khelo India</h3>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
                <p className="text-sm text-gray-500">Reviving sports culture in India at the grass-root level.</p>
                {isVerified ? (
                    <span className="mt-3 inline-block text-xs font-semibold text-green-600">Eligible to Apply</span>
                ) : (
                    <span className="mt-3 inline-block text-xs text-gray-400">Requires Verification</span>
                )}
            </a>

            <a
                href="https://sportsauthorityofindia.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition group"
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">SAI Schemes</h3>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
                <p className="text-sm text-gray-500">Sports Authority of India training and promotion schemes.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
