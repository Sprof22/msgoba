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
  const buttonLabel = verifying ? "Verify email" : "Reset password";
  const preheader = verifying
    ? "Verify your MSGOBA account to continue your membership request."
    : "Use this secure link to choose a new MSGOBA password.";
  const { error } = await resend.emails.send({
    from: process.env.AUTH_EMAIL_FROM || "MSG Class of 2012 <onboarding@resend.dev>", to, subject: verifying ? "Verify your MSG 2012 account" : "Reset your MSG 2012 password",
    html: buildAuthEmailHtml({
      name,
      url,
      heading: verifying ? "Welcome to the brotherhood" : "Reset your password",
      intro: verifying
        ? "Verify your email address to continue your membership request."
        : "Use the secure link below to choose a new password. If you did not request this, you can safely ignore this message.",
      buttonLabel,
      preheader,
      note: verifying
        ? "Verification links expire in 24 hours and can only be used once."
        : "Reset links expire in 1 hour and can only be used once.",
    }),
  });
  if (error) throw new Error(error.message);
  return {};
}

function buildAuthEmailHtml({
  name,
  url,
  heading,
  intro,
  buttonLabel,
  preheader,
  note,
}: {
  name: string;
  url: string;
  heading: string;
  intro: string;
  buttonLabel: string;
  preheader: string;
  note: string;
}) {
  const escapedName = escapeHtml(name);
  const escapedIntro = escapeHtml(intro);
  const escapedHeading = escapeHtml(heading);
  const escapedButton = escapeHtml(buttonLabel);
  const escapedNote = escapeHtml(note);
  const escapedPreheader = escapeHtml(preheader);
  const escapedUrl = escapeHtml(url);
  const logoUrl = getLogoUrl(url);
  const logoBlock = logoUrl
    ? `<img src="${logoUrl}" width="64" height="64" alt="MSGOBA logo" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto 14px;"/>`
    : "";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f8f5ee;font-family:Arial,sans-serif;color:#13233b;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapedPreheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f5ee;padding:22px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e3e7ec;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background:#071d3c;background-image:linear-gradient(135deg,#071d3c 0%,#0b2a54 75%);padding:28px 26px;text-align:center;">
                ${logoBlock}
                <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#f4e4bd;font-weight:700;">Mount Saint Gabriel&apos;s Old Boys Association</div>
                <div style="font-size:24px;line-height:1.2;color:#ffffff;font-weight:800;margin-top:10px;">Class of 2012</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 30px 22px;">
                <h1 style="margin:0 0 14px;font-size:30px;line-height:1.15;color:#071d3c;">${escapedHeading}</h1>
                <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:#13233b;">Hello ${escapedName},</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#637083;">${escapedIntro}</p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:999px;background:#d7a84a;">
                      <a href="${escapedUrl}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;line-height:1;color:#071d3c;text-decoration:none;border-radius:999px;">${escapedButton}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 14px;font-size:12px;line-height:1.6;color:#637083;">${escapedNote}</p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#637083;">Button not working? Copy and paste this link into your browser:<br/><a href="${escapedUrl}" style="color:#123f78;word-break:break-all;">${escapedUrl}</a></p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e3e7ec;padding:16px 30px 20px;background:#f8fafc;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#637083;">MSGOBA Class of 2012 · Official Alumni Community</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function getLogoUrl(targetUrl:string){
  try {
    const origin = new URL(targetUrl).origin;
    return `${origin}/images/msgoba-logo.png`;
  } catch {
    return undefined;
  }
}

function escapeHtml(value:string){return value.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]!))}
