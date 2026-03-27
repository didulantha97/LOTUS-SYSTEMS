import { NextRequest, NextResponse } from "next/server";

import { getControlPlaneBaseUrl } from "@/app/lib/controlPlane";

export async function POST(request: NextRequest) {
  const endpoint = `${getControlPlaneBaseUrl()}/api/v1/webhooks/stripe`;

  try {
    const payload = await request.json();
    const response = await fetch(endpoint, {
      method: "POST",
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
    const message = error instanceof Error ? error.message : "Unexpected webhook proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
