import { NextRequest, NextResponse } from "next/server";

import { getControlPlaneBaseUrl } from "@/app/lib/controlPlane";

export async function PUT(request: NextRequest, { params }: { params: { productKey: string } }) {
  const endpoint = `${getControlPlaneBaseUrl()}/api/v1/admin/products/${params.productKey}/status`;

  try {
    const payload = await request.json();
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected product status proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
