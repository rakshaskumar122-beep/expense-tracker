import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Typography,
  Grid,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";
import { TransactionContext } from "../context/TransactionContext";
import { LanguageContext } from "../context/LanguageContext";
import { incomeCategories, expenseCategories } from "../constants/categories";

const initial = {
  type: "Expense",
  category: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function Form() {
  const [data, setData] = useState(initial);
  const { addTransaction } = useContext(TransactionContext);
  const { t, tc } = useContext(LanguageContext);

  const categories = data.type === "Income" ? incomeCategories : expenseCategories;

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!data.category || !data.amount) return;
    addTransaction({ ...data, amount: Number(data.amount), id: uuidv4() });
    setData(initial);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("form.title")}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField select fullWidth label={t("form.type")} name="type"
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value, category: "" })}>
            <MenuItem value="Income">{t("type.Income")}</MenuItem>
            <MenuItem value="Expense">{t("type.Expense")}</MenuItem>
          </TextField>
        </Grid>
        <Grid size={6}>
          <TextField select fullWidth label={t("form.category")} name="category"
            value={data.category} onChange={handleChange}>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{tc(c)}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={6}>
          <TextField fullWidth type="number" label={t("form.amount")} name="amount"
            value={data.amount} onChange={handleChange} />
        </Grid>
        <Grid size={6}>
          <TextField fullWidth type="date" label={t("form.date")} name="date"
            value={data.date} onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }} />
        </Grid>
        <Grid size={12}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            {t("form.create")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}