"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations/profile";
import { updateProfileAction } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES, PROVINCE_CITIES, AGE_GROUPS, GENDER_OPTIONS, PROFILE_TYPES, type Province } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateInput>({ resolver: zodResolver(profileUpdateSchema) });

  const selectedProvince = watch("province") as Province | undefined;

  const { execute, isExecuting } = useAction(updateProfileAction, {
    onSuccess: () => {
      toast.success("Profile updated!");
      router.push("/profile");
    },
    onError: ({ error }) => {
      toast.error(typeof error.serverError === "string" ? error.serverError : "Update failed");
    },
  });

  const onSubmit = (data: ProfileUpdateInput) => {
    execute(data);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Edit Profile</h1>
        <p className="text-[#A0A0A0] text-sm mt-1">Update your public profile information</p>
      </div>

      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Display Name"
            placeholder="Your display name"
            {...register("displayName")}
            error={errors.displayName?.message}
          />
          <Input
            label="Full Name (optional)"
            placeholder="Your full name"
            {...register("fullName")}
            error={errors.fullName?.message}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Bio</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] px-4 py-2 text-sm text-white placeholder:text-[#6B7280] focus:border-[#DC143C] focus:outline-none focus:ring-1 focus:ring-[#DC143C] resize-none"
              placeholder="Tell Nepal who you are..."
              {...register("bio")}
            />
            {errors.bio && <p className="text-xs text-red-400">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white">Province</label>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Province" /></SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white">City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={!selectedProvince}>
                    <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
                    <SelectContent>
                      {(selectedProvince ? PROVINCE_CITIES[selectedProvince] : []).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

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
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        field.value === g.value
                          ? "bg-[#DC143C] border-[#DC143C] text-white"
                          : "bg-[#1E1E1E] border-[#2A2A2A] text-[#A0A0A0] hover:border-[#DC143C]/50"
                      }`}
                    >
                      {g.label}
                    </button>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Age Group</label>
            <Controller
              name="ageGroup"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Age group" /></SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Profile Type</label>
            <Controller
              name="profileType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="I am a..." /></SelectTrigger>
                  <SelectContent>
                    {PROFILE_TYPES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isExecuting} disabled={!isDirty}>
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
