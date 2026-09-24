"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function BetsChart({ data }: { data: { date: string; net: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-ink-faint">
        Pas encore assez de paris réglés pour tracer une courbe.
      </p>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#26302A" vertical={false} />
          <XAxis dataKey="date" stroke="#9AA89D" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#9AA89D" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#121813", border: "1px solid #26302A", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#F1F5EF" }}
            formatter={(value) => [`${value} FCFA`, "Bilan cumulé"]}
          />
          <Line type="monotone" dataKey="net" stroke="#2BD576" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
