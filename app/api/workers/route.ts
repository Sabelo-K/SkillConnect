import { NextRequest, NextResponse } from "next/server";
import { getWorkers, addWorker } from "@/lib/store";
import { Trade } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trade = searchParams.get("trade");
  const ward = searchParams.get("ward");

  let workers = getWorkers();
  if (trade && trade !== "All") {
    workers = workers.filter((w) => w.trade === trade);
  }
  if (ward && ward !== "All") {
    workers = workers.filter((w) => w.ward === ward);
  }
  return NextResponse.json(workers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const worker = addWorker({
    name: body.name,
    phone: body.phone,
    trade: body.trade as Trade,
    ward: body.ward,
    area: body.area,
    yearsExperience: Number(body.yearsExperience),
    bio: body.bio,
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
    workPhotos: [],
    available: true,
  });
  return NextResponse.json(worker, { status: 201 });
}
