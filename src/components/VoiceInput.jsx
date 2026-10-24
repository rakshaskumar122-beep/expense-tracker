import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Paper, Typography, TextField, MenuItem, Box, Alert } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { TransactionContext } from "../context/TransactionContext";
import { incomeCategories, expenseCategories } from "../constants/categories";
import { languages, budgetWords, incomeWords, keywords } from "../constants/voice";
import { extractNumber } from "../constants/numbers";

export default function VoiceInput() {
  const { addTransaction, setBudget } = useContext(TransactionContext);
  const [lang, setLang] = useState("en-IN");
  const [msg, setMsg] = useState(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (listening || !transcript) return;

    const text = transcript.toLowerCase();
    const amount = extractNumber(text);

    if (!amount) {
      setMsg({ severity: "warning", text: `Heard: "${transcript}" - I couldn't find an amount. Say the number, like 500.` });
      resetTranscript();
      return;
    }

    const isBudget = budgetWords.some((w) => text.includes(w));
    const isIncome = !isBudget && incomeWords.some((w) => text.includes(w));
    const allowed = isIncome ? incomeCategories : expenseCategories;
    const category = allowed.find((c) => (keywords[c] || []).some((w) => text.includes(w)));

    if (isBudget) {
      if (!category || category === "Other") {
        setMsg({ severity: "warning", text: `Heard: "${transcript}" - which category is the budget for? Try "set food budget 1000".` });
      } else {
        setBudget(category, Number(amount));
        setMsg({ severity: "success", text: `Budget set: ${category} = ₹${amount} (heard: "${transcript}")` });
      }
    } else {
      const finalCategory = category || "Other";
      addTransaction({
        id: uuidv4(),
        type: isIncome ? "Income" : "Expense",
        category: finalCategory,
        amount: Number(amount),
        date: new Date().toISOString().slice(0, 10),
      });
      setMsg({
        severity: "success",
        text: `Added ${isIncome ? "income" : "expense"}: ${finalCategory} ₹${amount} (heard: "${transcript}")`,
      });
    }
    resetTranscript();
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      Voice needs Chrome or Edge. Please open this link in Chrome.
    </Alert>
  );
}

  return (
    <Paper sx={{ p: 2, mb: 2, textAlign: "center" }}>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
        <TextField select size="small" value={lang} disabled={listening}
          onChange={(e) => setLang(e.target.value)} sx={{ minWidth: 120 }}>
          {languages.map((l) => (
            <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color={listening ? "error" : "primary"}
          startIcon={<MicIcon />}
          onClick={() => {
            setMsg(null);
            listening
              ? SpeechRecognition.stopListening()
              : SpeechRecognition.startListening({ language: lang });
          }}
        >
          {listening ? "Stop" : "Speak"}
        </Button>
      </Box>

      <Typography sx={{ mt: 1 }} color="text.secondary">
        {listening ? transcript || "Listening..." : 'Try: "food 500", "salary 5000", "set food budget 1000"'}
      </Typography>

      {msg && <Alert severity={msg.severity} sx={{ mt: 1, textAlign: "left" }}>{msg.text}</Alert>}
    </Paper>
  );
}