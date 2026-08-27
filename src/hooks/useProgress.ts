import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MODULES, type BusinessType } from "@/lib/digigrow-data";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  business_name: string;
  business_type: BusinessType;
};

export type Progress = {
  user_id: string;
  completed_modules: string[];
  quiz_scores: Record<string, number>;
  challenge_days: number[];
  task_done_on: string | null;
};

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, business_name, business_type")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["progress", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Progress | null> => {
      const { data, error } = await supabase
        .from("progress")
        .select("user_id, completed_modules, quiz_scores, challenge_days, task_done_on")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Progress | null;
    },
  });
}

export function useUpdateProgress() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Omit<Progress, "user_id">>) => {
      const { error } = await supabase
        .from("progress")
        .upsert({ user_id: user!.id, ...patch, updated_at: new Date().toISOString() })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress", user?.id] }),
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Omit<Profile, "id">>) => {
      const { error } = await supabase
        .from("profiles")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", user?.id] }),
  });
}

export const coursePercent = (p?: Progress | null) =>
  Math.round(((p?.completed_modules.length ?? 0) / MODULES.length) * 100);

export const quizTotal = (p?: Progress | null) =>
  Object.values(p?.quiz_scores ?? {}).reduce((a, b) => a + b, 0);

export const quizMax = MODULES.length * 5;
