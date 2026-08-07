/**
 * Utility to convert Euro currency amounts in cents to German words.
 * Example: 50000 cents -> "Fünfhundert Euro"
 * Example: 25050 cents -> "Zweihundertfünfzig Euro und fünfzig Cent"
 */

const ONES = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
const ONES_END = ["", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
const TEENS = [
  "zehn",
  "elf",
  "zwölf",
  "dreizehn",
  "vierzehn",
  "fünfzehn",
  "sechzehn",
  "siebzehn",
  "achtzehn",
  "neunzehn",
];
const TENS = ["", "zehn", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];

function convertUnderThousand(n: number, isEnd = false): string {
  if (n === 0) return "";

  let result = "";

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundreds > 0) {
    if (hundreds === 1) {
      result += "einhundert";
    } else {
      result += ONES[hundreds] + "hundert";
    }
  }

  if (remainder > 0) {
    if (remainder < 10) {
      result += isEnd ? ONES_END[remainder] : ONES[remainder];
    } else if (remainder >= 10 && remainder < 20) {
      result += TEENS[remainder - 10];
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const onesDigit = remainder % 10;
      if (onesDigit === 0) {
        result += TENS[tensDigit];
      } else {
        result += ONES[onesDigit] + "und" + TENS[tensDigit];
      }
    }
  }

  return result;
}

export function numberToGermanWords(totalCents: number): string {
  if (totalCents <= 0 || isNaN(totalCents)) {
    return "Null Euro";
  }

  const euros = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  let euroWords = "";

  if (euros === 0) {
    euroWords = "Null Euro";
  } else if (euros === 1) {
    euroWords = "Ein Euro";
  } else if (euros < 1000) {
    const raw = convertUnderThousand(euros, true);
    euroWords = raw.charAt(0).toUpperCase() + raw.slice(1) + " Euro";
  } else if (euros < 1000000) {
    const thousands = Math.floor(euros / 1000);
    const remainder = euros % 1000;

    const thousandPart = thousands === 1 ? "eintausend" : convertUnderThousand(thousands) + "tausend";
    const remainderPart = convertUnderThousand(remainder, true);

    const raw = thousandPart + remainderPart;
    euroWords = raw.charAt(0).toUpperCase() + raw.slice(1) + " Euro";
  } else {
    euroWords = `${euros.toLocaleString("de-DE")} Euro`;
  }

  if (cents > 0) {
    const centWords = convertUnderThousand(cents, true);
    return `${euroWords} und ${centWords} Cent`;
  }

  return euroWords;
}

export function numberToEnglishWords(totalCents: number): string {
  if (totalCents <= 0 || isNaN(totalCents)) return "Zero euros";
  const euros = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  let str = `${euros.toLocaleString("en-US")} euro${euros === 1 ? "" : "s"}`;
  if (cents > 0) {
    str += ` and ${cents} cent${cents === 1 ? "" : "s"}`;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
