import { LoginForm } from "@/components/auth/login-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";
import Image from "next/image";
import Link from "next/link";

export default async function LoginPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <div className="flex min-h-screen lg:h-screen bg-background text-foreground">
      {/* Left Panel - Form Area */}
      <div className="flex w-full flex-col lg:w-1/2 p-6 sm:p-12 md:p-16 xl:p-24 justify-between h-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-primary text-primary-foreground font-bold shadow-sm">
              I
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Identitree</h1>
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col justify-center w-full max-w-[380px] mx-auto py-12">
          <div className="mb-8 space-y-2.5">
            <h2 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Log in to your account to manage your digital profiles.
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <Link 
              href="/signup" 
              className="font-medium text-foreground hover:text-primary underline underline-offset-4 transition-colors"
            >
              Create one
            </Link>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-auto">
          &copy; {new Date().getFullYear()} Identitree Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 p-6 lg:p-8 pl-0">
        <div className="relative w-full h-full overflow-hidden rounded-none bg-muted/30 border border-border/50 shadow-sm">
          <Image
            src="/assets/login-page-hero.png"
            alt="Identitree platform preview"
            width={1200}
            height={1200}
            className="w-full h-full object-cover object-center"
            priority
          />
          {/* Subtle gradient overlay to enhance premium feel */}
          <div className="absolute inset-0 bg-gradient-to-tr from-background/5 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
