import { useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import { AuthContext } from "./context/AuthContext";
import { Provider } from "./context/TransactionContext";
import Login from "./components/Login";
import App from "./App";

export default function Gate() {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (!user) return <Login />;

  return (
    <Provider key={user.uid} userId={user.uid}>
      <App />
    </Provider>
  );
}