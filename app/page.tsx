"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const PASSWORD = "dWens@34";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogin = () => {
    if (password === PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });
    if (!error) setLeads(data || []);
    setLoading(false);
  };

  const exportCSV = () => {
    const headers = ["ID", "Patente", "Nombre", "DNI", "WhatsApp", "Email", "Fecha"];
    const rows = leads.map((l) => [
      l.id, l.plate, l.full_name, l.dni, l.whatsapp, l.email,
      l.created_at ? new Date(l.created_at).toLocaleString("es-AR") : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const filteredLeads = leads.filter((l) =>
    [l.plate, l.full_name, l.dni].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  useEffect(() => {
    if (authenticated) fetchLeads();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Panel Admin</h1>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 outline-none mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Ingresar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-zinc-400 text-sm mt-1">{leads.length} leads en total</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchLeads}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition"
            >
              Actualizar
            </button>
            <button
              onClick={exportCSV}
              className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Exportar CSV
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Buscar por patente, nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 outline-none mb-6 text-sm"
        />
        {loading ? (
          <p className="text-zinc-400">Cargando...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-zinc-400">No hay leads.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-800">
                  <th className="text-left py-3 pr-4">Patente</th>
                  <th className="text-left py-3 pr-4">Nombre</th>
                  <th className="text-left py-3 pr-4">DNI</th>
                  <th className="text-left py-3 pr-4">WhatsApp</th>
                  <th className="text-left py-3 pr-4">Email</th>
                  <th className="text-left py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-zinc-800 hover:bg-zinc-900 transition">
                    <td className="py-3 pr-4 font-mono">{lead.plate}</td>
                    <td className="py-3 pr-4">{lead.full_name}</td>
                    <td className="py-3 pr-4">{lead.dni}</td>
                    <td className="py-3 pr-4">{lead.whatsapp}</td>
                    <td className="py-3 pr-4">{lead.email}</td>
                    <td className="py-3 text-zinc-400">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleString("es-AR")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}