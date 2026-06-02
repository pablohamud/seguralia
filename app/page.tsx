"use client";

import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function HomePage() {
  const [plate, setPlate] = useState("");
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState<string[]>([]);

  const [fullName, setFullName] = useState("");
  const [dni, setDni] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const handleSearch = async () => {
    if (!plate) return;

    setLoading(true);
    setError("");
    setVehicle(null);

    try {
      const response = await fetch(`/api/vehicle/${plate}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error");
      }

      setVehicle(data);

      setHistory((prev) =>
        [plate, ...prev.filter((p) => p !== plate)].slice(0, 5)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async () => {
  if (!fullName.trim()) {
    alert("Por favor ingresá tu nombre y apellido");
    return;
  }

  if (!/^\d{7,8}$/.test(dni)) {
    alert("El DNI debe tener 7 u 8 números");
    return;
  }

  if (!/^\d{10,11}$/.test(whatsapp.replace(/\s/g, ""))) {
    alert("El WhatsApp debe tener 10 u 11 números");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("El email no es válido");
    return;
  }

  try {
    const { error } = await supabase
      .from("leads")
      .insert([
        {
          plate,
          full_name: fullName,
          dni,
          whatsapp,
          email,
        },
      ]);

    if (error) {
      throw error;
    }

    alert("Cotización solicitada correctamente");

    setFullName("");
    setDni("");
    setWhatsapp("");
    setEmail("");
  } catch (error) {
    console.error(error);
    alert("Error guardando lead");
  }
};

      alert("Cotización solicitada correctamente");

      setFullName("");
      setDni("");
      setWhatsapp("");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Error guardando lead");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-3 text-center">
          Vehicle Lookup AR
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Buscar información de vehículos por patente
        </p>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="AA123BB"
            value={plate}
            onChange={(e) =>
              setPlate(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            maxLength={7}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-4 text-xl uppercase outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-white text-black px-6 rounded-2xl font-semibold hover:opacity-90"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {loading && (
          <div className="text-center text-zinc-400">
            Buscando vehículo...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-2xl p-4 mb-6">
            {error}
          </div>
        )}

        {history.length > 0 && (
          <div className="mb-6">
            <p className="text-zinc-400 mb-2 text-sm">
              Búsquedas recientes
            </p>

            <div className="flex flex-wrap gap-2">
              {history.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPlate(item);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 transition px-3 py-2 rounded-xl text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {vehicle && (
          <>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h2>

                <p className="text-zinc-400 text-lg">
                  {vehicle.version}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-400 text-sm">Año</p>
                  <p className="text-xl font-semibold">
                    {vehicle.year}
                  </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-400 text-sm">
                    Combustible
                  </p>
                  <p className="text-xl font-semibold">
                    {vehicle.fuel}
                  </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-400 text-sm">Tipo</p>
                  <p className="text-xl font-semibold">
                    {vehicle.type}
                  </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-400 text-sm">
                    Transmisión
                  </p>
                  <p className="text-xl font-semibold">
                    {vehicle.transmission}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Solicitar cotización
              </h3>

              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Nombre y apellido"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none"
                />

                <input
                  type="text"
                  placeholder="DNI"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none"
                />

                <input
                  type="text"
                  placeholder="WhatsApp"
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(e.target.value)
                  }
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none"
                />

                <button
                  onClick={handleLeadSubmit}
                  className="bg-white text-black py-4 rounded-2xl font-semibold hover:opacity-90 transition"
                >
                  Solicitar cotización
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
