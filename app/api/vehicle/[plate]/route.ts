import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ plate: string }> }
) {
  const { plate } = await params;
  const normalizedPlate = plate.toUpperCase();

  console.log(
    "API KEY:",
    process.env.CLASIFIC_API_KEY ? "existe" : "VACÍA"
  );

  try {
    const response = await fetch(
      `https://api.clasific.ar/v1/vehicles/basic?plate=${normalizedPlate}&classification=true`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLASIFIC_API_KEY}`,
        },
      }
    );

    console.log("STATUS:", response.status);

    const text = await response.text();

    console.log("BODY:", text);

    // TEMPORAL PARA DEBUG
    return NextResponse.json({
      status: response.status,
      body: text,
    });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Error al consultar la API" },
      { status: 500 }
    );
  }
}