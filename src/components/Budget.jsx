import { useState, useContext } from "react";
import {
  Paper, Typography, TextField, MenuItem, Button,
  LinearProgress, Alert, Box,
} from "@mui/material";
import { TransactionContext } from "../context/TransactionContext";
import { expenseCategories } from "../constants/categories";

export default function Budget() {
  const { transactions, budgets, setBudget, removeBudget } =
    useContext(TransactionContext);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const month = new Date().toISOString().slice(0, 7);
  const spent = {};
  transactions
    .filter((t) => t.type === "Expense" && t.date.startsWith(month))
    .forEach((t) => {
      spent[t.category] = (spent[t.category] || 0) + t.amount;
    });

  const saveBudget = () => {
    if (!category || !limit) return;
    setBudget(category, Number(limit));
    setCategory("");
    setLimit("");
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Budgets
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField select size="small" label="Category" value={category}
          onChange={(e) => setCategory(e.target.value)} sx={{ flex: 1 }}>
          {expenseCategories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
        <TextField size="small" type="number" label="Limit ₹" value={limit}
          onChange={(e) => setLimit(e.target.value)} sx={{ width: 110 }} />
        <Button variant="contained" onClick={saveBudget}>Set</Button>
      </Box>

      {Object.keys(budgets).length === 0 && (
        <Typography color="text.secondary">
          No budgets yet. Set one here or by voice.
        </Typography>
      )}

      {Object.entries(budgets).map(([cat, max]) => {
        const used = spent[cat] || 0;
        const pct = Math.round((used / max) * 100);
        const color = pct >= 100 ? "error" : pct >= 80 ? "warning" : "success";
        return (
          <Box key={cat} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight="bold">{cat}</Typography>
              <Typography variant="body2">₹{used} / ₹{max} ({pct}%)</Typography>
            </Box>
            <LinearProgress variant="determinate" color={color}
              value={Math.min(pct, 100)} sx={{ height: 10, borderRadius: 5, my: 0.5 }} />
            {pct >= 100 && (
              <Alert severity="error" sx={{ mt: 1 }}>
                You crossed your {cat} budget by ₹{used - max}!
              </Alert>
            )}
            {pct >= 80 && pct < 100 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                You've used {pct}% of your {cat} budget.
              </Alert>
            )}
            <Button size="small" color="inherit" onClick={() => removeBudget(cat)}>
              Remove
            </Button>
          </Box>
        );
      })}
    </Paper>
  );
}