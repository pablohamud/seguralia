import { NextResponse } from "next/server";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const csvPath = path.join(process.cwd(), "leads.csv");

    const fileExists = fs.existsSync(csvPath);

    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      fieldDelimiter: ";",
      header: [
        { id: "plate", title: "PATENTE" },
        { id: "fullName", title: "NOMBRE" },
        { id: "dni", title: "DNI" },
        { id: "whatsapp", title: "WHATSAPP" },
        { id: "email", title: "EMAIL" },
      ],
      append: fileExists,
    });

    await csvWriter.writeRecords([body]);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error guardando lead",
      },
      { status: 500 }
    );
  }
}