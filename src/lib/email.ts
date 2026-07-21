import { Resend } from "resend";

const FROM = "RoteiroApp <noreply@roteiroapp.com>";
const APP_URL = process.env.NEXTAUTH_URL ?? "https://roteiroapp.com";

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendOtpEmail(email: string, otp: string, name?: string | null) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Seu código de acesso — RoteiroApp",
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1A5FCC,#2570E8);padding:32px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,.15);border-radius:12px;padding:12px 20px;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.5px;">✈ RoteiroApp</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
              Olá${name ? `, ${name.split(" ")[0]}` : ""}! 👋
            </h2>
            <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">
              Usamos verificação em duas etapas para proteger sua conta. Insira o código abaixo para concluir o login:
            </p>
            <div style="background:#f0f4ff;border:2px dashed #2570E8;border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
              <div style="font-size:42px;font-weight:800;letter-spacing:10px;color:#1A5FCC;font-family:'Courier New',monospace;">${otp}</div>
              <p style="margin:12px 0 0;color:#6b7280;font-size:13px;">Válido por <strong>10 minutos</strong></p>
            </div>
            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
              Se você não tentou fazer login, ignore este email. Sua conta está segura.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} RoteiroApp · noreply@roteiroapp.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string | null) {
  const url = `${APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Redefinir sua senha — RoteiroApp",
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1A5FCC,#2570E8);padding:32px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,.15);border-radius:12px;padding:12px 20px;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.5px;">✈ RoteiroApp</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
              Redefinir senha${name ? `, ${name.split(" ")[0]}` : ""}
            </h2>
            <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">
              Recebemos um pedido para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
            </p>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#1A5FCC,#2570E8);color:#ffffff;font-weight:700;font-size:16px;padding:14px 36px;border-radius:8px;text-decoration:none;">
                🔑 Redefinir senha
              </a>
            </div>
            <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">Este link expira em <strong>1 hora</strong>.</p>
            <p style="margin:8px 0 0;color:#9ca3af;font-size:13px;">Se você não solicitou isso, ignore este email. Sua senha permanece a mesma.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} RoteiroApp · noreply@roteiroapp.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendVerificationEmail(email: string, token: string, name?: string | null) {
  // Aponta para a ROTA DE API (que valida o token e redireciona para a página com
  // ?success=1 / ?error=...). Apontar para a página `/verify-email` direto faz o
  // token ser ignorado e o usuário cair no texto "enviamos um link" para sempre.
  const url = `${APP_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Confirme seu email — RoteiroApp",
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1A5FCC,#2570E8);padding:32px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,.15);border-radius:12px;padding:12px 20px;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.5px;">✈ RoteiroApp</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
              Bem-vindo${name ? `, ${name.split(" ")[0]}` : ""}! 🎉
            </h2>
            <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">
              Você está a um clique de começar a planejar suas viagens. Confirme seu endereço de email para ativar sua conta:
            </p>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#1A5FCC,#2570E8);color:#ffffff;font-weight:700;font-size:16px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:.3px;">
                ✅ Confirmar email
              </a>
            </div>
            <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;line-height:1.5;">
              Ou copie e cole este link no navegador:
            </p>
            <p style="margin:0;word-break:break-all;color:#2570E8;font-size:12px;">${url}</p>
            <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;">Este link expira em <strong>24 horas</strong>.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} RoteiroApp · noreply@roteiroapp.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
