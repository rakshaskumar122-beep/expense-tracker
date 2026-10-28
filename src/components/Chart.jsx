import { useContext } from "react";
import { Paper, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TransactionContext } from "../context/TransactionContext";
import { LanguageContext } from "../context/LanguageContext";

const COLORS = ["#556b2f", "#8a9a5b", "#c0a23d", "#a0522d", "#6b8e8e", "#b5651d", "#7d8471"];

export default function Chart({ type }) {
  const { transactions } = useContext(TransactionContext);
  const { t, tc } = useContext(LanguageContext);

  const totals = {};
  transactions
    .filter((tx) => tx.type === type)
    .forEach((tx) => {
      totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
    });

  const data = Object.entries(totals).map(([name, value]) => ({ name: tc(name), value }));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">
        {t(`type.${type}`)}: ₹{total}
      </Typography>
      {data.length === 0 ? (
        <Typography color="text.secondary">{t("chart.noData")}</Typography>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}