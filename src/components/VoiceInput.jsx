import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Paper, Typography, TextField, MenuItem, Box, Alert } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { TransactionContext } from "../context/TransactionContext";
import { incomeCategories, expenseCategories } from "../constants/categories";
import { languages, budgetWords, incomeWords, keywords } from "../constants/voice";
import { extractNumber } from "../constants/numbers";
import { parseDate } from "../constants/dateParse";

export default function VoiceInput() {
  const { addTransaction, setBudget } = useContext(TransactionContext);
  const [lang, setLang] = useState("en-IN");
  const [msg, setMsg] = useState(null);
  const [typed, setTyped] = useState("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const processText = (raw) => {
            const { date, rest } = parseDate(raw);
    const text = rest;
    const amount = extractNumber(text);

    if (!amount) {
      setMsg({ severity: "warning", text: `Heard: "${raw}" - I couldn't find an amount. Say the number, like 500.` });
      return;
    }

    const isBudget = budgetWords.some((w) => text.includes(w));
    const isIncome = !isBudget && incomeWords.some((w) => text.includes(w));
    const allowed = isIncome ? incomeCategories : expenseCategories;
    const category = allowed.find((c) => (keywords[c] || []).some((w) => text.includes(w)));

    if (isBudget) {
      if (!category || category === "Other") {
        setMsg({ severity: "warning", text: `Heard: "${raw}" - which category is the budget for? Try "set food budget 1000".` });
      } else {
        setBudget(category, Number(amount));
        setMsg({ severity: "success", text: `Budget set: ${category} = ₹${amount} (heard: "${raw}")` });
      }
    } else {
      const finalCategory = category || "Other";
      addTransaction({
        id: uuidv4(),
        type: isIncome ? "Income" : "Expense",
        category: finalCategory,
        amount: Number(amount),
                       date,
      });
      setMsg({
        severity: "success",
        text: `Added ${isIncome ? "income" : "expense"}: ${finalCategory} ₹${amount} on ${date} (heard: "${raw}")`,
      });
    }
  };

  useEffect(() => {
    if (listening || !transcript) return;
    processText(transcript);
    resetTranscript();
  }, [listening]);

  const submitTyped = () => {
    if (!typed.trim()) return;
    processText(typed);
    setTyped("");
  };

  return (
    <Paper sx={{ p: 2, mb: 2, textAlign: "center" }}>
      {browserSupportsSpeechRecognition && (
        <>
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
                if (listening) {
                  SpeechRecognition.stopListening();
                } else {
                  resetTranscript();
                  SpeechRecognition.startListening({ language: lang, continuous: false });
                }
              }}
            >
              {listening ? "Stop" : "Speak"}
            </Button>
          </Box>
          <Typography sx={{ mt: 1 }} color="text.secondary">
            {listening ? transcript || "Listening... speak now, then pause" : 'Try: "food 500", "salary 5000", "set food budget 1000"'}
          </Typography>
        </>
      )}

      <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
        Phone not hearing you? Tap the box, then the 🎤 on your keyboard.
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField fullWidth size="small" value={typed}
          placeholder='e.g. "food 500"'
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitTyped()} />
        <Button variant="contained" onClick={submitTyped}>Add</Button>
      </Box>

      {msg && <Alert severity={msg.severity} sx={{ mt: 1, textAlign: "left" }}>{msg.text}</Alert>}
    </Paper>
  );
}