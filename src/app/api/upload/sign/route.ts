import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

/**
 * Assinatura de upload do Cloudinary — só é entregue a usuários AUTENTICADOS.
 *
 * Fecha o buraco do preset "unsigned" (que ficava exposto no bundle e permitia
 * upload anônimo). Para ativar: definir no Railway CLOUDINARY_API_KEY +
 * CLOUDINARY_API_SECRET, marcar NEXT_PUBLIC_CLOUDINARY_SIGNED=true e trocar o
 * preset do Cloudinary para "Signed" (ou remover o unsigned).
 */
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const FOLDER = "roteiroapp";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!CLOUD || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: "Upload assinado não configurado." }, { status: 503 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // Assina os parâmetros (ordem alfabética) + api_secret, conforme a Cloudinary.
  const toSign = `folder=${FOLDER}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + API_SECRET).digest("hex");

  return NextResponse.json({ cloudName: CLOUD, apiKey: API_KEY, timestamp, folder: FOLDER, signature });
}
