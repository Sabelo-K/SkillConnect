import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("partner_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, organisation, email, phone, type, message } = body;
    if (!name || !organisation || !email || !type || !message) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("partner_inquiries")
      .insert({ name, organisation, email, phone: phone ?? "", type, message })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}
