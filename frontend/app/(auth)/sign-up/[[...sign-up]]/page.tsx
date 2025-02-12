"use client"

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left column */}
      <div className="hidden w-1/2 flex-col justify-between p-10 lg:flex bg-zinc-900">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl font-bold">
            <span className="text-[#FF6B2C]">T</span>
            <span className="text-white">radeMark Pro</span>
          </span>
        </Link>
        <div className="space-y-2">
          <p className="text-lg font-medium text-white">
            &quot;Finally, a trademark search platform that makes sense. No more complex TESS queries - just simple, accurate results that help protect my clients&apos; brands.&quot;
          </p>
          <p className="text-sm text-gray-300">Sarah Chen, IP Attorney</p>
        </div>
      </div>

      {/* Right column */}
      <div className="flex w-full items-center justify-center lg:w-1/2 bg-black">
        <div className="w-full max-w-sm px-4">
          <SignUp 
            appearance={{
              elements: {
                socialButtonsBlockButton: "border border-gray-800",               
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}