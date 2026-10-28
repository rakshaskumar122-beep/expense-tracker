import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Paper, Typography, TextField, MenuItem, Box, Alert } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { TransactionContext } from "../context/TransactionContext";
import { LanguageContext } from "../context/LanguageContext";
import { incomeCategories, expenseCategories } from "../constants/categories";
import { languages, budgetWords, incomeWords, keywords } from "../constants/voice";
import { extractNumber, removeNumber } from "../constants/numbers";
import { parseDate } from "../constants/dateParse";

export default function VoiceInput() {
  const { addTransaction, setBudget } = useContext(TransactionContext);
  const { t, tc, voiceCode } = useContext(LanguageContext);
  const [lang, setLang] = useState(voiceCode);
  const [msg, setMsg] = useState(null);
  const [typed, setTyped] = useState("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const processText = (raw) => {
    const { date, rest } = parseDate(raw);
    const text = rest;
    const amount = extractNumber(text);

    if (!amount) {
      setMsg({ severity: "warning", text: t("voice.noAmount", { raw }) });
      return;
    }

    const isBudget = budgetWords.some((w) => text.includes(w));
    const isIncome = !isBudget && incomeWords.some((w) => text.includes(w));
    const allowed = isIncome ? incomeCategories : expenseCategories;
    const category = allowed.find((c) => (keywords[c] || []).some((w) => text.includes(w)));

    if (isBudget) {
      if (!category || category === "Other") {
        setMsg({ severity: "warning", text: t("voice.noCategory", { raw }) });
      } else {
        setBudget(category, Number(amount));
        setMsg({
          severity: "success",
          text: t("voice.budgetSet", { cat: tc(category), amount, raw }),
        });
      }
    } else {
      const finalCategory = category || makeLabel(text);
      addTransaction({
        id: uuidv4(),
        type: isIncome ? "Income" : "Expense",
        category: finalCategory,
        amount: Number(amount),
        date,
      });
      setMsg({
        severity: "success",
        text: t("voice.added", {
          kind: (isIncome ? t("type.Income") : t("type.Expense")).toLowerCase(),
          cat: tc(finalCategory),
          amount,
          date,
          raw,
        }),
      });
    }
  };
  const FILLER = ["rupees", "rupee", "rs", "inr", "₹", "for", "on", "spent", "paid", "of", "in", "the", "a", "add"];

// Turns what the person said into a category name, e.g. "movie 500" -> "Movie"
const makeLabel = (text) => {
  const skip = [...FILLER, ...incomeWords, ...budgetWords];
  const words = removeNumber(text)
    .split(" ")
    .filter((w) => w && !skip.includes(w));
  if (words.length === 0) return "Other";
  const label = words.join(" ").slice(0, 30);
  return label.charAt(0).toUpperCase() + label.slice(1);
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
              {listening ? t("voice.stop") : t("voice.speak")}
            </Button>
          </Box>
          <Typography sx={{ mt: 1 }} color="text.secondary">
            {listening ? transcript || t("voice.listening") : t("voice.hint")}
          </Typography>
        </>
      )}

      <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
        {t("voice.phoneHint")}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField fullWidth size="small" value={typed}
          placeholder={t("voice.placeholder")}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitTyped()} />
        <Button variant="contained" onClick={submitTyped}>{t("voice.add")}</Button>
      </Box>

      {msg && <Alert severity={msg.severity} sx={{ mt: 1, textAlign: "left" }}>{msg.text}</Alert>}
    </Paper>
  );
}