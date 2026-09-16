import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { InvalidFileError, uploadProductImage } from "@/modules/storage/storage.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }

  try {
    const uploaded = await uploadProductImage(file);
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    if (error instanceof InvalidFileError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Échec de l'upload." }, { status: 500 });
  }
}
