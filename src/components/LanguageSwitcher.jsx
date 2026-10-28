import { useContext, useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { LanguageContext } from "../context/LanguageContext";
import { LANGUAGES } from "../i18n/translations";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [anchor, setAnchor] = useState(null);
  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <>
      <Button
        color="inherit"
        size="small"
        startIcon={<TranslateIcon />}
        aria-label={t("lang.button")}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ mr: 1 }}
      >
        {current.label}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {LANGUAGES.map((l) => (
          <MenuItem
            key={l.code}
            selected={l.code === language}
            onClick={() => {
              setLanguage(l.code);
              setAnchor(null);
            }}
          >
            {l.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}