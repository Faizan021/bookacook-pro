/**
 * Schnitzel Schmiede Festival Cash Register — Euro Number-to-Words Converter
 * Supports German & English formatting for currency floats.
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

function convertUnderThousandDE(n: number, isEnd = false): string {
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
    const raw = convertUnderThousandDE(euros, true);
    euroWords = raw.charAt(0).toUpperCase() + raw.slice(1) + " Euro";
  } else if (euros < 1000000) {
    const thousands = Math.floor(euros / 1000);
    const remainder = euros % 1000;

    const thousandPart = thousands === 1 ? "eintausend" : convertUnderThousandDE(thousands) + "tausend";
    const remainderPart = convertUnderThousandDE(remainder, true);

    const raw = thousandPart + remainderPart;
    euroWords = raw.charAt(0).toUpperCase() + raw.slice(1) + " Euro";
  } else {
    euroWords = `${euros.toLocaleString("de-DE")} Euro`;
  }

  if (cents > 0) {
    const centWords = convertUnderThousandDE(cents, true);
    const centSuffix = cents === 1 ? "Cent" : "Cent";
    return `${euroWords} und ${centWords} ${centSuffix}`;
  }

  return euroWords;
}

const EN_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const EN_TEENS = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const EN_TENS = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function convertUnderThousandEN(n: number): string {
  if (n === 0) return "";
  let res = "";
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundreds > 0) {
    res += EN_ONES[hundreds] + " hundred";
    if (remainder > 0) res += " ";
  }

  if (remainder > 0) {
    if (remainder < 10) {
      res += EN_ONES[remainder];
    } else if (remainder >= 10 && remainder < 20) {
      res += EN_TEENS[remainder - 10];
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const onesDigit = remainder % 10;
      res += EN_TENS[tensDigit];
      if (onesDigit > 0) {
        res += "-" + EN_ONES[onesDigit];
      }
    }
  }

  return res;
}

export function numberToEnglishWords(totalCents: number): string {
  if (totalCents <= 0 || isNaN(totalCents)) return "Zero euros";
  const euros = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  let euroWords = "";
  if (euros === 0) {
    euroWords = "Zero euros";
  } else if (euros === 1) {
    euroWords = "One euro";
  } else if (euros < 1000) {
    const raw = convertUnderThousandEN(euros);
    euroWords = raw.charAt(0).toUpperCase() + raw.slice(1) + " euros";
  } else if (euros < 1000000) {
    const thousands = Math.floor(euros / 1000);
    const remainder = euros % 1000;
    const thouPart = thousands === 1 ? "one thousand" : convertUnderThousandEN(thousands) + " thousand";
    const remPart = convertUnderThousandEN(remainder);
    const raw = (thouPart + (remPart ? " " + remPart : "")).trim();
    euroWords = raw.charAt(0).toUpperCase() + raw.slice(1) + " euros";
  } else {
    euroWords = `${euros.toLocaleString("en-US")} euros`;
  }

  if (cents > 0) {
    const centWords = convertUnderThousandEN(cents);
    return `${euroWords} and ${centWords} cent${cents === 1 ? "" : "s"}`;
  }

  return euroWords;
}
