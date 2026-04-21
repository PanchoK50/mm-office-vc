"use server";

import { createServerClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export type ClaimResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function submitClaim(
  formData: FormData,
): Promise<ClaimResult> {
  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const phone = (formData.get("phone") as string | null)?.trim();
  const fundName =
    (formData.get("fund_name") as string | null)?.trim() || null;
  const file = formData.get("file") as File | null;
  const viaWhatsapp = formData.get("via_whatsapp") === "true";

  if (!name || !email || !phone || !fundName) {
    return {
      ok: false,
      error: "Name, email, phone, and fund are required.",
    };
  }

  const hasFile = file && file.size > 0;

  if (!hasFile && !viaWhatsapp) {
    return {
      ok: false,
      error: "Please upload a payment confirmation or select the WhatsApp option.",
    };
  }

  if (hasFile) {
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false, error: "File must be under 5 MB." };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        ok: false,
        error: "Only JPEG, PNG, WebP, or PDF files are accepted.",
      };
    }
  }

  const supabase = createServerClient();

  let filePath: string | null = null;
  let fileName: string | null = null;

  if (hasFile) {
    const claimPrefix = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    filePath = `${claimPrefix}/${safeName}`;
    fileName = file.name;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("[submitClaim] upload failed:", uploadError);
      return {
        ok: false,
        error: `File upload failed: ${uploadError.message}`,
      };
    }
  }

  const { error: rpcError } = await supabase.rpc("reserve_spot", {
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_fund_name: fundName,
    p_file_path: filePath,
    p_file_name: fileName,
  });

  if (rpcError) {
    console.error("[submitClaim] reserve_spot failed:", rpcError);
    if (rpcError.message?.includes("NO_SPOTS_AVAILABLE")) {
      return { ok: false, error: "All spots are currently taken." };
    }
    return {
      ok: false,
      error: `Reservation failed: ${rpcError.message ?? "unknown error"}`,
    };
  }

  return {
    ok: true,
    message: "Your spot is reserved. We'll confirm within 24 hours.",
  };
}
