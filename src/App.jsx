import { useContext, useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Container, Paper,
  List, ListItem, ListItemText, IconButton, Box, Tabs, Tab,
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

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0);

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
        {page === "home" && (
          <>
            <Paper
              sx={{
                p: 3, mb: 2, color: "white",
                background: "linear-gradient(135deg,#556b2f,#8a9a5b)",
                display: "flex",
                textAlign: "center",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">Total Balance</Typography>
                <Typography variant="h4" fontWeight="bold">₹{balance}</Typography>
              </Box>

              <Box sx={{ width: "1px", bgcolor: "rgba(255,255,255,0.5)", mx: 1 }} />

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">Spent</Typography>
                <Typography variant="h4" fontWeight="bold">₹{expense}</Typography>
              </Box>
            </Paper>

            <VoiceInput />
            <Budget />
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
          </>
        )}

        {page === "charts" && (
          <>
            <Chart type="Income" />
            <Chart type="Expense" />
          </>
        )}
      </Container>
    </>
  );
}