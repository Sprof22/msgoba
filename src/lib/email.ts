import "server-only";
import { Resend } from "resend";

export async function sendAuthEmail({ to, name, url, purpose }: { to:string; name:string; url:string; purpose:"verify"|"reset" }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") throw new Error("Email delivery is not configured.");
    console.info(`[DEV AUTH EMAIL] ${purpose} for ${to}: ${url}`);
    return { developmentUrl: url };
  }
  const resend = new Resend(apiKey);
  const verifying = purpose === "verify";
  const { error } = await resend.emails.send({
    from: process.env.AUTH_EMAIL_FROM || "MSG Class of 2012 <onboarding@resend.dev>", to, subject: verifying ? "Verify your MSG 2012 account" : "Reset your MSG 2012 password",
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#13233b"><h1 style="color:#071d3c">${verifying ? "Welcome to the brotherhood" : "Reset your password"}</h1><p>Hello ${escapeHtml(name)},</p><p>${verifying ? "Verify your email address to continue your membership request." : "Use the secure link below to choose a new password. If you did not request this, you can ignore this message."}</p><p style="margin:30px 0"><a href="${url}" style="background:#071d3c;color:white;padding:13px 20px;border-radius:99px;text-decoration:none;font-weight:bold">${verifying ? "Verify email" : "Reset password"}</a></p><p style="font-size:12px;color:#637083">This link expires soon and can only be used once.</p></div>`,
  });
  if (error) throw new Error(error.message);
  return {};
}
function escapeHtml(value:string){return value.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]!))}
