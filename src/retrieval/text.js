const STOP = new Set([
  "и", "в", "во", "на", "по", "для", "при", "из", "к", "с", "со", "о", "об",
  "the", "a", "an", "and", "or", "of", "to", "for", "in", "on", "with", "by", "is", "are",
  "какой", "какая", "какие", "каков", "что", "кто", "как", "где", "когда", "почему",
  "зачем", "расскажи", "опиши", "покажи", "объясни", "какого", "какому", "каким",
  "каком", "какую", "это", "тот", "эта", "эти", "все", "весь", "вся", "бы", "ли", "же"
]);

const VOWELS = "аеиоуыэюя";
const RV_SUFFIXES = [
  "ившись", "ывшись", "ивши", "ывши", "ившись", "ывшись", "ировать",
  "ениями", "ениями", "анием", "ениями", "иями", "ями", "ами",
  "ого", "ему", "ому", "его", "ыми", "ими", "ее", "ие", "ые", "ое",
  "ей", "ий", "ый", "ой", "ем", "им", "ым", "ом", "их", "ых",
  "ую", "юю", "ая", "яя", "ою", "ею", "а", "я", "о", "е", "у", "ю", "ы", "и",
  "ившись", "ывшись", "ив", "ыв", "вшись", "вши", "в",
  "ешь", "ете", "ишь", "ите", "ешься", "етесь", "ишься", "итесь",
  "ала", "яли", "али", "али", "ала", "яли", "ать", "ять", "ить", "ыть",
  "ется", "ится", "утся", "ются", "атся", "ятся", "ался", "ялась", "ились",
  "ать", "ять", "уть", "ють", "ит", "ат", "ят", "ет", "ют", "ла", "ли", "л",
  "нно", "енно", "ено", "ено", "ено", "ены", "ена", "ены", "ен", "нн",
  "ость", "ости", "ост", "ение", "ения", "ений", "ством", "ство", "ства",
  "иями", "ями", "ами", "ах", "ях", "ов", "ев", "ом", "ем", "ам", "ям",
  "а", "я", "ы", "и", "ь"
];

function stemRussian(word) {
  if (word.length < 4 || !/[а-я]/u.test(word)) return word;
  const firstVowel = [...word].findIndex((char) => VOWELS.includes(char));
  if (firstVowel < 0 || firstVowel === word.length - 1) return word;
  let rv = word.slice(firstVowel + 1);
  const prefix = word.slice(0, firstVowel + 1);
  for (const suffix of RV_SUFFIXES) {
    if (rv.endsWith(suffix) && rv.length - suffix.length >= 1) {
      rv = rv.slice(0, -suffix.length);
      break;
    }
  }
  rv = rv.replace(/нн$/u, "н").replace(/ь$/u, "");
  return prefix + rv || word;
}

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFKC")
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/u)
    .filter((token) => token.length > 1 && !STOP.has(token))
    .map(stemRussian);
}

export function tokenize(value = "") {
  return normalizeText(value);
}

export function documentText(document = {}) {
  const fields = [
    document.id,
    document.title,
    document.label,
    document.summary,
    document.description,
    document.content,
    document.text,
    document.domain,
    document.type,
    document.purpose,
    document.scope,
    document.evidence_class,
    document.procedure_id,
    ...(document.topics ?? []),
    ...(document.topic ?? []),
    ...(document.tags ?? []),
    ...(document.keywords ?? []),
    ...(document.aliases ?? []),
    ...(document.limitations ?? [])
  ];
  return fields.filter(Boolean).join(" ");
}
