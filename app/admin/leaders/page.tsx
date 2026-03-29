"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeaderAction } from "@/lib/actions/admin";
import { leaderCreateSchema, type LeaderCreateInput } from "@/lib/validations/leader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES } from "@/lib/constants";
import { toast } from "sonner";
import { Plus, Star } from "lucide-react";

const OFFICE_LEVELS = ["LOCAL", "MUNICIPAL", "DISTRICT", "PROVINCIAL", "NATIONAL"] as const;

export default function AdminLeadersPage() {
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeaderCreateInput>({ resolver: zodResolver(leaderCreateSchema) });

  const { execute, isExecuting } = useAction(createLeaderAction, {
    onSuccess: () => {
      toast.success("Leader created!");
      reset();
      setShowForm(false);
    },
    onError: ({ error }) => toast.error(typeof error.serverError === "string" ? error.serverError : "Failed"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-black text-white">Manage Leaders</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4" />
          Add Leader
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Add New Leader</h2>
          <form onSubmit={handleSubmit((data) => execute(data))} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Name" placeholder="Full name" {...register("name")} error={errors.name?.message} />
              <Input label="Office / Position" placeholder="e.g. Prime Minister" {...register("office")} error={errors.office?.message} />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white">Office Level</label>
                <Controller
                  name="officeLevel"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        {OFFICE_LEVELS.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.officeLevel && <p className="text-xs text-red-400">{errors.officeLevel.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white">Province</label>
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Province (optional)" /></SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <Input label="Party" placeholder="Political party (optional)" {...register("party")} error={errors.party?.message} />
              <Input label="Region" placeholder="Region or constituency (optional)" {...register("region")} error={errors.region?.message} />
              <Input label="Photo URL" placeholder="https://..." {...register("photoUrl")} error={errors.photoUrl?.message} />
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-white">Description</label>
                <textarea
                  placeholder="Brief description..."
                  className="flex min-h-[80px] w-full rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] px-4 py-2 text-sm text-white placeholder:text-[#6B7280] focus:border-[#DC143C] focus:outline-none resize-none"
                  {...register("description")}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" loading={isExecuting}>Create Leader</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 text-center">
        <p className="text-[#A0A0A0] text-sm">Use the form above to add leader profiles. Created leaders appear on the public /leaders page.</p>
      </div>
    </div>
  );
}
