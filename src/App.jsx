import { useContext } from "react";
import {
  AppBar, Toolbar, Typography, Button, Container, Paper,
  List, ListItem, ListItemText, IconButton, Box,LinearProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { TransactionContext } from "./context/TransactionContext";
import { AuthContext } from "./context/AuthContext";
import Form from "./components/Form";
import Chart from "./components/Chart";
import VoiceInput from "./components/VoiceInput";
import Budget from "./components/Budget";

export default function App() {
  const { transactions, balance, deleteTransaction } = useContext(TransactionContext);
  const { user, logOut } = useContext(AuthContext);
     const income = transactions
     .filter((t) => t.type === "Income")
     .reduce((s, t) => s + t.amount, 0);
   const expense = transactions
     .filter((t) => t.type === "Expense")
     .reduce((s, t) => s + t.amount, 0);
   const spentPct = income > 0 ? Math.round((expense / income) * 100) : 0;
   const barColor = spentPct >= 100 ? "error" : spentPct >= 80 ? "warning" : "success";

  return (
    <>
      <AppBar position="static" sx={{ background: "linear-gradient(135deg,#556b2f,#8a9a5b)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            💰 Expense Tracker
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
            {user.email}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3, mb: 5 }}>
        <Paper
          sx={{
            p: 3, mb: 2, textAlign: "center", color: "white",
            background: "linear-gradient(135deg,#556b2f,#8a9a5b)",
          }}
        >
          <Typography variant="subtitle1">Total Balance</Typography>
          <Typography variant="h3" fontWeight="bold">₹{balance}</Typography>
        </Paper>
           <Paper sx={{ p: 2, mb: 2 }}>
     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
       <Typography fontWeight="bold">Spent so far</Typography>
       <Typography fontWeight="bold">{spentPct}%</Typography>
     </Box>
     <LinearProgress
       variant="determinate"
       color={barColor}
       value={Math.min(spentPct, 100)}
       sx={{ height: 12, borderRadius: 6, my: 1 }}
     />
     <Typography variant="body2" color="text.secondary">
       ₹{expense} spent of ₹{income} income
     </Typography>
     {income === 0 && expense > 0 && (
       <Typography variant="body2" color="error">
         Add some income to see your spending percentage.
       </Typography>
     )}
   </Paper>
        <Budget />
        <Chart type="Income" />
        <Chart type="Expense" />
        <VoiceInput />
        <Form />

        <Paper>
          <List>
            {transactions.length === 0 && (
              <ListItem>
                <ListItemText primary="No transactions yet" />
              </ListItem>
            )}
            {transactions.map((t) => {
              const isIncome = t.type === "Income";
              return (
                <ListItem
                  key={t.id}
                  sx={{ borderLeft: 5, borderColor: isIncome ? "success.main" : "error.main" }}
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight="bold" color={isIncome ? "success.main" : "error.main"}>
                        {isIncome ? "+" : "-"}₹{t.amount}
                      </Typography>
                      <IconButton onClick={() => deleteTransaction(t.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText primary={t.category} secondary={t.date} />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Container>
    </>
  );
}