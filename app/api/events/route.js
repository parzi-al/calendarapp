import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "events.json");

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const events = JSON.parse(data);
    return NextResponse.json(events);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to read events" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newEvent = await request.json();
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const events = JSON.parse(data);
    events.push({ id: Date.now(), ...newEvent }); // Add unique ID

    fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
    return NextResponse.json({ message: "Event saved" }, { status: 200 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedEvent = await request.json();
    const data = fs.readFileSync(filePath, "utf-8");
    let events = JSON.parse(data);

    const index = events.findIndex((e) => e.id === updatedEvent.id);
    if (index === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    events[index] = updatedEvent;
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
    return NextResponse.json({ message: "Event updated" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const data = fs.readFileSync(filePath, "utf-8");
    let events = JSON.parse(data);

    const updatedEvents = events.filter((event) => event.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(updatedEvents, null, 2));
    return NextResponse.json({ message: "Event deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
