import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ plate: string }> }
) {
  const { plate } = await params;

  const normalizedPlate = plate.toUpperCase();

  const vehicles: Record<string, any> = {
    AA123BB: {
      brand: "Toyota",
      model: "Corolla",
      version: "XEI CVT",
      year: 2021,
      fuel: "Nafta",
      type: "Sedán",
      transmission: "Automática",
    },

    AC987ZZ: {
      brand: "Volkswagen",
      model: "Golf GTI",
      version: "2.0 TSI",
      year: 2018,
      fuel: "Nafta",
      type: "Hatchback",
      transmission: "Automática",
    },
  };

  const vehicle = vehicles[normalizedPlate];

  if (!vehicle) {
    return NextResponse.json(
      {
        error: "Vehículo no encontrado",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(vehicle);
}