import { useState, useContext } from "react";
import { Box, Paper, Typography, TextField, Button, Alert, Divider } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { signUp, logIn, googleLogin, resetPassword } = useContext(AuthContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) await signUp(email, password);
      else await logIn(email, password);
    } catch (err) {
      setError(err.code?.replace("auth/", "").replace(/-/g, " ") || "Something went wrong");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await googleLogin();
    } catch (err) {
      setError("Google sign-in failed");
    }
  };

     const handleReset = async () => {
     if (!email) return setError("Type your email first, then tap Forgot password");
     try {
       await resetPassword(email);
       setError("Reset link sent. Check your email (and spam folder).");
     } catch (err) {
       setError("Could not send reset email");
     }
   };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#556b2f,#8a9a5b)",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 380 }} elevation={6}>
        <Typography variant="h4" align="center"  fontWeight="bold" sx={{color: "#0e0e0b"}}>
          💰 Expense Tracker
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
          {isSignUp ? "Create your account" : "Welcome back, please log in"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Password (min 6 characters)" type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }} required />
          <Button fullWidth type="submit" variant="contained" size="large">
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>
        <Button fullWidth variant="outlined" sx={{ mt: 2, bgcolor: "#181715", color: "#080707", "&:hover": {bgcolor: "#a98d2f"} }}
            onClick={handleGoogle}>
            Continue with Google
        </Button>

        <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: "#ded9d0", color: "#e4d9d9", "&:hover": { bgcolor: "#a98d2f"}}} 
        onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Log in" : "New here? Sign up"}
             <Button fullWidth size="small" sx={{ mt: 1 }} onClick={handleReset}>
     Forgot password?
   </Button>
        </Button>
      </Paper>
    </Box>
  );
}