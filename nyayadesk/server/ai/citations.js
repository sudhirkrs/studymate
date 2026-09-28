// Citation Guard: extracts every Indian case citation from an AI answer and
// grades it against (a) the sources retrieved during this research session and
// (b) a small index of landmark judgments whose citations are settled.
//   verified   — the citation or case name appears in a retrieved source
//   landmark   — matches the built-in landmark index
//   unverified — found in neither; the advocate must check it before relying on it

// Reporter patterns seen in Indian practice.
const PATTERNS = [
  /\(\d{4}\)\s*\d{1,2}\s*SCC\s*(?:\(Cri\)\s*)?\d{1,4}/g, // (2017) 10 SCC 1
  /\d{4}\s*Supp\.?\s*\(\d\)\s*SCC\s*\d{1,4}/g, // 1992 Supp (1) SCC 335
  /\d{4}\s*SCC\s*OnLine\s*[A-Za-z]{2,6}\s*\d{1,6}/g, // 2023 SCC OnLine SC 123
  /AIR\s*\d{4}\s*[A-Z][A-Za-z]{1,5}\s*\d{1,5}/g, // AIR 1973 SC 1461
  /\d{4}\s*INSC\s*\d{1,5}/g, // 2024 INSC 123
  /\[\d{4}\]\s*\d{1,2}\s*S\.?C\.?R\.?\s*\d{1,5}/g, // [2019] 3 SCR 1
  /\(\d{4}\)\s*\d{1,3}\s*(?:SCR|Cri\s?LJ|CriLJ|Comp\s?Cas|ITR|GSTL|STC|DRJ|Bom\s?LR|MLJ|KLT)\s*\d{1,5}/g,
  /\d{4}\s*(?:Cri\s?LJ|CriLJ)\s*\d{1,5}/g, // 2003 CriLJ 123
  /\d{4}:[A-Z]{2,6}:\d{1,6}(?:-[A-Z]{2,4})?/g, // 2024:DHC:1234 neutral citations
];

// Case name: "X v. Y" / "X vs. Y" — capitalised words either side.
const WORD = "[A-Z][\\w.&'()-]*";
const NAME = `${WORD}(?:\\s+(?:(?:of|and|the|for|&)\\s+)?${WORD}){0,6}`;
const CASE_NAME = new RegExp(`\\b(${NAME})\\s+(?:v\\.|vs\\.?|versus)\\s+(${NAME})`, 'g');

// Landmark judgments with settled citations (Supreme Court of India).
export const LANDMARKS = [
  { name: 'Kesavananda Bharati v. State of Kerala', cites: ['(1973) 4 SCC 225', 'AIR 1973 SC 1461'] },
  { name: 'Maneka Gandhi v. Union of India', cites: ['(1978) 1 SCC 248', 'AIR 1978 SC 597'] },
  { name: 'Bachan Singh v. State of Punjab', cites: ['(1980) 2 SCC 684'] },
  { name: 'M.C. Mehta v. Union of India', cites: ['(1987) 1 SCC 395'] },
  { name: 'State of Haryana v. Bhajan Lal', cites: ['1992 Supp (1) SCC 335'] },
  { name: 'Indra Sawhney v. Union of India', cites: ['1992 Supp (3) SCC 217'] },
  { name: 'S.R. Bommai v. Union of India', cites: ['(1994) 3 SCC 1'] },
  { name: 'D.K. Basu v. State of West Bengal', cites: ['(1997) 1 SCC 416'] },
  { name: 'Vishaka v. State of Rajasthan', cites: ['(1997) 6 SCC 241'] },
  { name: 'Rangappa v. Sri Mohan', cites: ['(2010) 11 SCC 441'] },
  { name: 'Lalita Kumari v. Government of Uttar Pradesh', cites: ['(2014) 2 SCC 1'] },
  { name: 'Arnesh Kumar v. State of Bihar', cites: ['(2014) 8 SCC 273'] },
  { name: 'Dashrath Rupsingh Rathod v. State of Maharashtra', cites: ['(2014) 9 SCC 129'] },
  { name: 'Shreya Singhal v. Union of India', cites: ['(2015) 5 SCC 1'] },
  { name: 'K.S. Puttaswamy v. Union of India', cites: ['(2017) 10 SCC 1'] },
  { name: 'Navtej Singh Johar v. Union of India', cites: ['(2018) 10 SCC 1'] },
  { name: 'Joseph Shine v. Union of India', cites: ['(2019) 3 SCC 39'] },
  { name: 'Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal', cites: ['(2020) 7 SCC 1'] },
  { name: 'Satender Kumar Antil v. Central Bureau of Investigation', cites: ['(2022) 10 SCC 51'] },
];

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function partyKey(name) {
  // First significant word of the first party — robust to "State of X" etc.
  const words = name.replace(/[^A-Za-z .]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !/^(the|state|union|of|and|mr|mrs|ms|smt|shri|sri|m\/s)$/i.test(w));
  return words[0] ? norm(words[0]) : norm(name);
}

export function extractCitations(text) {
  const found = new Map();
  for (const re of PATTERNS) {
    for (const m of text.matchAll(re)) {
      const cite = m[0].replace(/\s+/g, ' ').trim();
      if (!found.has(norm(cite))) found.set(norm(cite), { type: 'citation', text: cite });
    }
  }
  for (const m of text.matchAll(CASE_NAME)) {
    const name = `${m[1].trim()} v. ${m[2].trim().replace(/[,.]$/, '')}`;
    if (name.length > 120) continue;
    const key = norm(name);
    if (![...found.values()].some((f) => f.type === 'case' && norm(f.text) === key)) {
      found.set(`case:${key}`, { type: 'case', text: name });
    }
  }
  return [...found.values()];
}

export function verifyCitations(text, sources = []) {
  const haystack = norm(sources.map((s) => `${s.title} ${s.url} ${(s.snippets || []).join(' ')}`).join(' '));
  const titles = sources.map((s) => norm(s.title || ''));
  return extractCitations(text).map((c) => {
    const key = norm(c.text);
    let status = 'unverified';
    let source = null;

    if (c.type === 'citation') {
      if (haystack.includes(key)) {
        status = 'verified';
        source = sources.find((s) => norm(`${s.title} ${(s.snippets || []).join(' ')}`).includes(key))?.url || null;
      } else if (LANDMARKS.some((l) => l.cites.some((x) => norm(x) === key))) {
        status = 'landmark';
      }
    } else {
      const pk = partyKey(c.text);
      const second = partyKey(c.text.split(/\s+v\.\s+/)[1] || '');
      const hit = sources.find((s, i) => titles[i].includes(pk) && (second.length < 3 || titles[i].includes(second)));
      if (hit) {
        status = 'verified';
        source = hit.url;
      } else if (LANDMARKS.some((l) => partyKey(l.name) === pk)) {
        status = 'landmark';
      }
    }
    return { ...c, status, source };
  });
}
