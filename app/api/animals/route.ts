import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";

async function getAnimalsData() {
  const filePath = path.join(process.cwd(), "data", "animals.json");
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function GET() {
  try {
    const data = await getAnimalsData();
    const dogs = (data.dogs as Array<Record<string, unknown>>).map((d) => ({ ...d, type: "dog" }));
    const cats = (data.cats as Array<Record<string, unknown>>).map((c) => ({ ...c, type: "cat" }));
    return NextResponse.json({ dogs, cats, all: [...dogs, ...cats] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load animals" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Niet geautoriseerd. Log eerst in." }, { status: 401 });
  }
  try {
    const body = await request.json();
    const stripType = (arr: Array<Record<string, unknown>>) =>
      arr.map(({ type: _, ...rest }) => rest);
    const toSave = {
      dogs: stripType(body.dogs || []),
      cats: stripType(body.cats || []),
    };
    const filePath = path.join(process.cwd(), "data", "animals.json");
    await writeFile(filePath, JSON.stringify(toSave, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save (write only works locally)" }, { status: 500 });
  }
}
