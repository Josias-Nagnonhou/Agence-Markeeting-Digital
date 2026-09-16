import { NextResponse } from "next/server";
import { PageNotFoundError } from "@/modules/page-builder/page.service";
import { getCheckoutRedirectForSlug } from "@/modules/checkout/checkout.service";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { redirectUrl } = await getCheckoutRedirectForSlug(slug);
    return NextResponse.redirect(redirectUrl, { status: 302 });
  } catch (error) {
    if (error instanceof PageNotFoundError) {
      return NextResponse.redirect(new URL("/", request.url), { status: 302 });
    }
    console.error(error);
    return NextResponse.redirect(new URL("/", request.url), { status: 302 });
  }
}
