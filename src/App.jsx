import { useContext, useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Container, Paper,
  List, ListItem, ListItemText, IconButton, Box, Tabs, Tab,LinearProgress,
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
     const [page, setPage] = useState("home");

const income = transactions
  .filter((t) => t.type === "Income")
  .reduce((s, t) => s + t.amount, 0);
const expense = transactions
  .filter((t) => t.type === "Expense")
  .reduce((s, t) => s + t.amount, 0);
const spentPct = income > 0 ? Math.round((expense / income) * 100) : 0;
const barColor =
  spentPct >= 100 ? "error.main" : spentPct >= 80 ? "warning.main" : "success.main";
const fillPct = Math.min(spentPct, 100);
const amountLabel = `₹${expense}`;

const labelSx = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: 14,
  whiteSpace: "nowrap",
};
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
        <Tabs
  value={page}
  onChange={(_, v) => setPage(v)}
  centered
  textColor="inherit"
  sx={{ "& .MuiTabs-indicator": { backgroundColor: "#ffffff" } }}
>
  <Tab label="Home" value="home" />
  <Tab label="Charts" value="charts" />
</Tabs>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3, mb: 5 }}>
        <Container maxWidth="sm" sx={{ mt: 3, mb: 5 }}>
  {page === "home" && (
    <>
      {/* 1. your existing Total Balance <Paper> stays here */}

      {/* 2. NEW spend bar (replaces the old "Spent so far" Paper) */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>Spent so far</Typography>
        <Box sx={{ position: "relative", height: 28, borderRadius: 14,
                   overflow: "hidden", bgcolor: "action.hover" }}>
          <Box sx={{ ...labelSx, color: "text.primary" }}>{amountLabel}</Box>
          {fillPct > 0 && (
            <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0,
                       width: `${fillPct}%`, bgcolor: barColor, overflow: "hidden" }}>
              <Box sx={{ ...labelSx, right: "auto",
                         width: `${(100 / fillPct) * 100}%`, color: "#ffffff" }}>
                {amountLabel}
              </Box>
            </Box>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          of ₹{income} income
        </Typography>
        {income === 0 && expense > 0 && (
          <Typography variant="body2" color="error">
            Add some income to see how much of it you've spent.
          </Typography>
        )}
      </Paper>

      {/* 3. speaker box right under the bar */}
      <VoiceInput />

      {/* 4. then the rest, in this order */}
      <Budget />
      <Form />
      {/* 5. your existing transaction list <Paper> stays here */}
    </>
  )}

  {page === "charts" && (
    <>
      <Chart type="Income" />
      <Chart type="Expense" />
    </>
  )}
</Container>
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