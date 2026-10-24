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
        Add Transaction
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField select fullWidth label="Type" name="type"
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value, category: "" })}>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </TextField>
        </Grid>
        <Grid size={6}>
          <TextField select fullWidth label="Category" name="category"
            value={data.category} onChange={handleChange}>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={6}>
          <TextField fullWidth type="number" label="Amount" name="amount"
            value={data.amount} onChange={handleChange} />
        </Grid>
        <Grid size={6}>
          <TextField fullWidth type="date" label="Date" name="date"
            value={data.date} onChange={handleChange}
            slotProps={{ inputLabel: { shrink: true } }} />
        </Grid>
        <Grid size={12}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}