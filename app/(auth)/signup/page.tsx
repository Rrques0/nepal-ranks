"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { signupAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROVINCES,
  PROVINCE_CITIES,
  AGE_GROUPS,
  GENDER_OPTIONS,
  PROFILE_TYPES,
  CATEGORIES,
  CATEGORY_LABELS,
  type Province,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { categories: [] },
  });

  const selectedProvince = watch("province") as Province | undefined;
  const selectedCategories = watch("categories") ?? [];

  const { execute, isExecuting, result } = useAction(signupAction);

  const onSubmit = (data: SignupInput) => {
    execute(data);
  };

  const toggleCategory = (cat: string) => {
    const current = selectedCategories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setValue("categories", next as (typeof CATEGORIES)[number][], { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white mb-2">Join Nepal Ranks</h1>
        <p className="text-[#A0A0A0]">Create your free account</p>
      </div>

      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        {result?.serverError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 mb-4">
            {result.serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                {...register("password")}
                error={errors.password?.message}
              />
            </div>
            <Input
              label="Username"
              placeholder="only_letters_numbers"
              {...register("username")}
              error={errors.username?.message}
            />
            <Input
              label="Display Name"
              placeholder="Your name"
              {...register("displayName")}
              error={errors.displayName?.message}
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Gender</label>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((g) => (
                <Controller
                  key={g.value}
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(g.value)}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors",
                        field.value === g.value
                          ? "bg-[#DC143C] border-[#DC143C] text-white"
                          : "bg-[#1E1E1E] border-[#2A2A2A] text-[#A0A0A0] hover:border-[#DC143C]/50"
                      )}
                    >
                      {g.label}
                    </button>
                  )}
                />
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-400">{errors.gender.message}</p>}
          </div>

          {/* Age Group */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Age Group</label>
            <Controller
              name="ageGroup"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.ageGroup && <p className="text-xs text-red-400">{errors.ageGroup.message}</p>}
          </div>

          {/* Province + City */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white">Province</label>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue("city", ""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.province && <p className="text-xs text-red-400">{errors.province.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white">City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedProvince}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      {(selectedProvince ? PROVINCE_CITIES[selectedProvince] : []).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && <p className="text-xs text-red-400">{errors.city.message}</p>}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">I compete in</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "py-3 px-4 rounded-lg text-sm font-medium border transition-colors text-left",
                    selectedCategories.includes(cat)
                      ? "bg-[#DC143C]/10 border-[#DC143C] text-[#DC143C]"
                      : "bg-[#1E1E1E] border-[#2A2A2A] text-[#A0A0A0] hover:border-[#DC143C]/50"
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            {errors.categories && (
              <p className="text-xs text-red-400">{errors.categories.message}</p>
            )}
          </div>

          {/* Profile Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">I am a</label>
            <Controller
              name="profileType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select profile type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_TYPES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.profileType && <p className="text-xs text-red-400">{errors.profileType.message}</p>}
          </div>

          <Button type="submit" loading={isExecuting} className="w-full" size="lg">
            Create Account
          </Button>

          <p className="text-xs text-[#6B7280] text-center">
            By joining, you agree to our terms. This is a community competition platform.
          </p>
        </form>
      </div>

      <p className="text-center text-sm text-[#A0A0A0]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#DC143C] hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
