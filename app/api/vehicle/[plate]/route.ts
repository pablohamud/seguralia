import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ plate: string }> }
) {
  const { plate } = await params;
  const normalizedPlate = plate.toUpperCase();

  try {
    const response = await fetch(
      `https://api.clasific.ar/v1/vehicles/basic?plate=${normalizedPlate}&classification=true`,
      {
        headers: {
          "x-api-key": process.env.CLASIFIC_API_KEY || "",
        },
      }
    );

    const rayId = response.headers.get("cf-ray") || "no disponible";
    const status = response.status;
    console.log(`CF-Ray: ${rayId} | Status: ${status} | Plate: ${normalizedPlate}`);

    const text = await response.text();
    console.log("Response body:", text.substring(0, 200));

    if (!response.ok) {
      return NextResponse.json(
        { error: "Vehículo no encontrado", rayId },
        { status: 404 }
      );
    }

    const data = JSON.parse(text);

    return NextResponse.json({
      brand: data.data.make,
      model: data.data.model,
      version: data.data.classification?.matchedModel || "",
      year: data.data.year,
      fuel: "",
      type: data.data.classification?.bodyType || "",
      transmission: "",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al consultar la API" },
      { status: 500 }
    );
  }
}