"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const { execute, isExecuting, result } = useAction(loginAction);

  const onSubmit = (data: LoginInput) => {
    execute(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
        <p className="text-[#A0A0A0]">Login to Nepal Ranks</p>
      </div>

      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 space-y-5">
        {result?.serverError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {result.serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button type="submit" loading={isExecuting} className="w-full" size="lg">
            Login
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2A2A2A]" />
          </div>
          <div className="relative flex justify-center text-xs text-[#6B7280] bg-[#141414] px-2">or</div>
        </div>

        <Button variant="outline" className="w-full" disabled>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google <span className="ml-1 text-[#6B7280] text-xs">(coming soon)</span>
        </Button>
      </div>

      <p className="text-center text-sm text-[#A0A0A0]">
        No account?{" "}
        <Link href="/signup" className="text-[#DC143C] hover:underline font-medium">
          Join Nepal Ranks free
        </Link>
      </p>
    </div>
  );
}
