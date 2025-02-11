import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0C10] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-[#FF6B2C] hover:bg-[#FF6B2C]/90",
              footerActionLink: 
                "text-[#FF6B2C] hover:text-[#FF6B2C]/90",
            },
          }}
        />
      </div>
    </div>
  );
} 