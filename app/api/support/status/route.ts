import { NextResponse } from "next/server";

import { getControlPlaneBaseUrl } from "@/app/lib/controlPlane";

export async function GET() {
  const endpoint = `${getControlPlaneBaseUrl()}/api/v1/support/status`;

  try {
    const response = await fetch(endpoint, {
      cache: "no-store"
    });

    const body = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Health request failed with status ${response.status}`,
          details: body
        },
        { status: response.status }
      );
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected health proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
