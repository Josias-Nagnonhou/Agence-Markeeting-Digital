"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function RevenueChart({ data }: { data: { month: string; revenue: number; subscribers: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#26302A" vertical={false} />
          <XAxis dataKey="month" stroke="#9AA89D" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="revenue"
            stroke="#9AA89D"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
          <YAxis yAxisId="subs" orientation="right" stroke="#9AA89D" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#121813", border: "1px solid #26302A", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#F1F5EF" }}
            formatter={(value, name) =>
              name === "revenue"
                ? [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Revenus"]
                : [String(value), "Abonnés actifs"]
            }
          />
          <Bar yAxisId="revenue" dataKey="revenue" fill="#2BD576" radius={[4, 4, 0, 0]} barSize={28} />
          <Line yAxisId="subs" type="monotone" dataKey="subscribers" stroke="#F5C542" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
