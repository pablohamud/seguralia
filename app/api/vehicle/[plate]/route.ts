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
      console.log("API KEY:", process.env.CLASIFIC_API_KEY ? "existe" : "VACÍA");
      {
        headers: {
          "x-api-key": process.env.CLASIFIC_API_KEY || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Vehículo no encontrado" },
        { status: 404 }
      );
    }

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
    return NextResponse.json(
      { error: "Error al consultar la API" },
      { status: 500 }
    );
  }
}