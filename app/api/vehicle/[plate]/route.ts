import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ plate: string }> }
) {
  const { plate } = await params;
  const normalizedPlate = plate.toUpperCase();

  try {
    const response = await fetch(
      `https://clasific.ar/api/v1/vehicles/basic?plate=${normalizedPlate}&classification=true`,
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
      brand: data.brand,
      model: data.model,
      version: data.version,
      year: data.year,
      fuel: data.fuel,
      type: data.classification?.vehicle_type || data.type,
      transmission: data.transmission,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al consultar la API" },
      { status: 500 }
    );
  }
}