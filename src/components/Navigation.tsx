"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function Navigation() {
  const pathname = usePathname();
  const { status, data: session } = useSession();

  if (status !== "authenticated") return null;

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/news", label: "News" },
    { href: "/schemes", label: "Schemes" },
    ...(session?.user?.isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-white font-bold text-xl">
              Kreeda
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === link.href
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-indigo-100 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu (simplified) */}
      <div className="md:hidden flex space-x-2 px-2 pt-2 pb-3 sm:px-3 overflow-x-auto">
        {links.map((link) => (
            <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                pathname === link.href
                ? "bg-indigo-700 text-white"
                : "text-indigo-100 hover:bg-indigo-500"
            }`}
            >
            {link.label}
            </Link>
        ))}
      </div>
    </nav>
  );
}
