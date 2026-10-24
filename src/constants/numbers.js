const nativeDigits = ["०१२३४५६७८९", "೦೧೨೩೪೫೬೭೮೯", "౦౧౨౩౪౫౬౭౮౯", "௦௧௨௩௪௫௬௭௮௯"];

function normalizeDigits(text) {
  return text.replace(/[०-९೦-೯౦-౯௦-௯]/g, (ch) => {
    for (const set of nativeDigits) {
      const i = set.indexOf(ch);
      if (i >= 0) return String(i);
    }
    return ch;
  });
}

const small = new Map();
const mult = new Map();
const add = (map, value, words) => words.forEach((w) => map.set(w, value));

// ---------- English ----------
const en = ["zero","one","two","three","four","five","six","seven","eight","nine","ten",
  "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
en.forEach((w, i) => add(small, i, [w]));
["twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"]
  .forEach((w, i) => add(small, (i + 2) * 10, [w]));
add(mult, 100, ["hundred"]);
add(mult, 1000, ["thousand"]);
add(mult, 100000, ["lakh", "lac", "lakhs"]);

// ---------- Hindi (Devanagari) ----------
const hi = [
  ["शून्य"], ["एक"], ["दो"], ["तीन"], ["चार"], ["पांच","पाँच"], ["छह","छः","छे"], ["सात"], ["आठ"], ["नौ"], ["दस"],
  ["ग्यारह"], ["बारह"], ["तेरह"], ["चौदह"], ["पंद्रह","पन्द्रह"], ["सोलह"], ["सत्रह"], ["अठारह"], ["उन्नीस"], ["बीस"],
  ["इक्कीस"], ["बाईस"], ["तेईस"], ["चौबीस"], ["पच्चीस"], ["छब्बीस"], ["सत्ताईस"], ["अट्ठाईस","अठाईस"], ["उनतीस"], ["तीस"],
  ["इकतीस"], ["बत्तीस"], ["तैंतीस"], ["चौंतीस"], ["पैंतीस"], ["छत्तीस"], ["सैंतीस"], ["अड़तीस"], ["उनतालीस"], ["चालीस"],
  ["इकतालीस"], ["बयालीस"], ["तैंतालीस"], ["चवालीस","चौवालीस"], ["पैंतालीस"], ["छियालीस"], ["सैंतालीस"], ["अड़तालीस"], ["उनचास"], ["पचास"],
  ["इक्यावन"], ["बावन"], ["तिरपन"], ["चौवन"], ["पचपन"], ["छप्पन"], ["सत्तावन"], ["अट्ठावन"], ["उनसठ"], ["साठ"],
  ["इकसठ"], ["बासठ"], ["तिरसठ"], ["चौंसठ"], ["पैंसठ"], ["छियासठ"], ["सड़सठ"], ["अड़सठ"], ["उनहत्तर"], ["सत्तर"],
  ["इकहत्तर"], ["बहत्तर"], ["तिहत्तर"], ["चौहत्तर"], ["पचहत्तर"], ["छिहत्तर"], ["सतहत्तर"], ["अठहत्तर"], ["उन्यासी"], ["अस्सी"],
  ["इक्यासी"], ["बयासी"], ["तिरासी"], ["चौरासी"], ["पचासी"], ["छियासी"], ["सत्तासी"], ["अट्ठासी"], ["नवासी"], ["नब्बे"],
  ["इक्यानवे"], ["बानवे"], ["तिरानवे"], ["चौरानवे"], ["पंचानवे"], ["छियानवे"], ["सत्तानवे"], ["अट्ठानवे"], ["निन्यानवे"],
];
hi.forEach((words, i) => add(small, i, words));
add(mult, 100, ["सौ"]);
add(mult, 1000, ["हज़ार", "हजार"]);
add(mult, 100000, ["लाख"]);

// ---------- Hinglish (Hindi in English letters) ----------
add(small, 1, ["ek"]); add(small, 2, ["do"]); add(small, 3, ["teen"]);
add(small, 4, ["char", "chaar"]); add(small, 5, ["panch", "paanch"]);
add(small, 6, ["chhe", "chhah", "cheh"]); add(small, 7, ["saat"]);
add(small, 8, ["aath"]); add(small, 9, ["nau"]); add(small, 10, ["das"]);
add(small, 20, ["bees"]); add(small, 50, ["pachas"]);
add(mult, 100, ["sau"]);
add(mult, 1000, ["hazaar", "hazar", "hajar"]);

// ---------- Kannada ----------
add(small, 1, ["ಒಂದು"]); add(small, 2, ["ಎರಡು"]); add(small, 3, ["ಮೂರು"]);
add(small, 4, ["ನಾಲ್ಕು"]); add(small, 5, ["ಐದು"]); add(small, 6, ["ಆರು"]);
add(small, 7, ["ಏಳು"]); add(small, 8, ["ಎಂಟು"]); add(small, 9, ["ಒಂಬತ್ತು"]);
add(small, 10, ["ಹತ್ತು"]); add(small, 11, ["ಹನ್ನೊಂದು"]); add(small, 12, ["ಹನ್ನೆರಡು"]);
add(small, 13, ["ಹದಿಮೂರು"]); add(small, 14, ["ಹದಿನಾಲ್ಕು"]); add(small, 15, ["ಹದಿನೈದು"]);
add(small, 16, ["ಹದಿನಾರು"]); add(small, 17, ["ಹದಿನೇಳು"]); add(small, 18, ["ಹದಿನೆಂಟು"]);
add(small, 19, ["ಹತ್ತೊಂಬತ್ತು"]); add(small, 20, ["ಇಪ್ಪತ್ತು"]); add(small, 30, ["ಮೂವತ್ತು"]);
add(small, 40, ["ನಲವತ್ತು"]); add(small, 50, ["ಐವತ್ತು"]); add(small, 60, ["ಅರವತ್ತು"]);
add(small, 70, ["ಎಪ್ಪತ್ತು"]); add(small, 80, ["ಎಂಬತ್ತು"]); add(small, 90, ["ತೊಂಬತ್ತು"]);
add(small, 200, ["ಇನ್ನೂರು"]); add(small, 300, ["ಮುನ್ನೂರು"]); add(small, 400, ["ನಾನೂರು"]);
add(small, 500, ["ಐನೂರು"]); add(small, 600, ["ಆರುನೂರು"]); add(small, 700, ["ಏಳುನೂರು"]);
add(small, 800, ["ಎಂಟುನೂರು"]); add(small, 900, ["ಒಂಬೈನೂರು"]);
add(mult, 100, ["ನೂರು"]); add(mult, 1000, ["ಸಾವಿರ"]); add(mult, 100000, ["ಲಕ್ಷ"]);

// ---------- Telugu ----------
add(small, 1, ["ఒకటి"]); add(small, 2, ["రెండు"]); add(small, 3, ["మూడు"]);
add(small, 4, ["నాలుగు"]); add(small, 5, ["ఐదు"]); add(small, 6, ["ఆరు"]);
add(small, 7, ["ఏడు"]); add(small, 8, ["ఎనిమిది"]); add(small, 9, ["తొమ్మిది"]);
add(small, 10, ["పది"]); add(small, 11, ["పదకొండు"]); add(small, 12, ["పన్నెండు"]);
add(small, 13, ["పదమూడు"]); add(small, 14, ["పద్నాలుగు"]); add(small, 15, ["పదిహేను"]);
add(small, 16, ["పదహారు"]); add(small, 17, ["పదిహేడు"]); add(small, 18, ["పద్దెనిమిది"]);
add(small, 19, ["పంతొమ్మిది"]); add(small, 20, ["ఇరవై"]); add(small, 30, ["ముప్పై"]);
add(small, 40, ["నలభై"]); add(small, 50, ["యాభై"]); add(small, 60, ["అరవై"]);
add(small, 70, ["డెబ్బై"]); add(small, 80, ["ఎనభై"]); add(small, 90, ["తొంభై"]);
add(mult, 100, ["వంద", "వందలు"]); add(mult, 1000, ["వెయ్యి", "వేలు"]); add(mult, 100000, ["లక్ష"]);

// ---------- Tamil ----------
add(small, 1, ["ஒன்று"]); add(small, 2, ["இரண்டு"]); add(small, 3, ["மூன்று"]);
add(small, 4, ["நான்கு"]); add(small, 5, ["ஐந்து"]); add(small, 6, ["ஆறு"]);
add(small, 7, ["ஏழு"]); add(small, 8, ["எட்டு"]); add(small, 9, ["ஒன்பது"]);
add(small, 10, ["பத்து"]); add(small, 11, ["பதினொன்று"]); add(small, 12, ["பன்னிரண்டு"]);
add(small, 13, ["பதிமூன்று"]); add(small, 14, ["பதினான்கு"]); add(small, 15, ["பதினைந்து"]);
add(small, 16, ["பதினாறு"]); add(small, 17, ["பதினேழு"]); add(small, 18, ["பதினெட்டு"]);
add(small, 19, ["பத்தொன்பது"]); add(small, 20, ["இருபது"]); add(small, 30, ["முப்பது"]);
add(small, 40, ["நாற்பது"]); add(small, 50, ["ஐம்பது"]); add(small, 60, ["அறுபது"]);
add(small, 70, ["எழுபது"]); add(small, 80, ["எண்பது"]); add(small, 90, ["தொண்ணூறு"]);
add(small, 200, ["இருநூறு"]); add(small, 300, ["முந்நூறு"]); add(small, 400, ["நானூறு"]);
add(small, 500, ["ஐநூறு", "ஐந்நூறு"]); add(small, 600, ["அறுநூறு"]); add(small, 700, ["எழுநூறு"]);
add(small, 800, ["எண்ணூறு"]); add(small, 900, ["தொள்ளாயிரம்"]);
add(mult, 100, ["நூறு"]); add(mult, 1000, ["ஆயிரம்"]); add(mult, 100000, ["லட்சம்"]);

// ---------- The reader ----------
export function extractNumber(input) {
  const text = normalizeDigits(input.toLowerCase()).replace(/(\d),(\d)/g, "$1$2");
  const tokens = text.split(/[\s,:;!?]+/).filter(Boolean);

  let total = 0;
  let current = 0;
  let started = false;

  for (const tok of tokens) {
    let handled = false;
    if (/^\d+$/.test(tok)) {
      current += Number(tok);
      handled = true;
    } else if (small.has(tok)) {
      current += small.get(tok);
      handled = true;
    } else if (mult.has(tok)) {
      const m = mult.get(tok);
      if (m === 100) current = (current || 1) * 100;
      else {
        total += (current || 1) * m;
        current = 0;
      }
      handled = true;
    }
    if (handled) started = true;
    else if (started) break; // stop at the end of the first number
  }

  const result = total + current;
  return started && result > 0 ? result : null;
}