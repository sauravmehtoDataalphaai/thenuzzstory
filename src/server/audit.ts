import { createServiceSupabase } from "@/server/supabase";
import type { AdminSession } from "@/server/admin-auth";

export async function writeAuditLog(input: {
  session: AdminSession;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    const admin = createServiceSupabase();
    await admin.from("audit_log").insert({
      actor_id: input.session.userId,
      actor_email: input.session.email,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? "",
      details: (input.details ?? {}) as import("@/types/database").Json,
    });
  } catch (err) {
    console.error("audit log failed", err);
  }
}
