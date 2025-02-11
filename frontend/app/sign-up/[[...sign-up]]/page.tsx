import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A0C10] flex flex-col items-center">
      <Link href="/" className="text-2xl font-bold mt-8 mb-16">
        <span className="text-[#FF6B2C]">T</span>
        <span className="text-white">radeMark Pro</span>
      </Link>
      
      <div className="w-full max-w-[400px] p-4">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-[#FF6B2C] hover:bg-[#FF6B2C]/90",
              footerActionLink: 
                "text-[#FF6B2C] hover:text-[#FF6B2C]/90",
              card: "bg-white rounded-lg shadow-none",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border border-gray-300",
              socialButtonsBlockButtonText: "text-gray-600",
              formFieldLabel: "text-gray-700",
              formFieldInput: "border-gray-300",
              dividerLine: "bg-gray-300",
              dividerText: "text-gray-600",
            },
          }}
        />
      </div>
    </div>
  );
} 