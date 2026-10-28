import { useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  List, ListItemButton, ListItemText,
} from "@mui/material";
import { LanguageContext } from "../context/LanguageContext";
import { LANGUAGES } from "../i18n/translations";

export default function LanguageDialog() {
  const { hasChosen, setLanguage, t } = useContext(LanguageContext);

  return (
    <Dialog open={!hasChosen} fullWidth maxWidth="xs" disableEscapeKeyDown>
      <DialogTitle>🌐 {t("lang.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("lang.subtitle")}</DialogContentText>
        <List>
          {LANGUAGES.map((l) => (
            <ListItemButton key={l.code} onClick={() => setLanguage(l.code)}>
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}