import { NextRequest, NextResponse } from "next/server";

import { getControlPlaneBaseUrl } from "@/app/lib/controlPlane";

export async function GET(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get("customerId");
  if (!customerId) {
    return NextResponse.json({ error: "customerId is required" }, { status: 400 });
  }

  const endpoint = `${getControlPlaneBaseUrl()}/api/v1/portal/subscriptions?customerId=${encodeURIComponent(customerId)}`;

  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected portal subscriptions proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
