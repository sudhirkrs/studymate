# ISC Study Mate

An all-in-one study companion for the **ISC (CISCE) syllabus, Classes XI and XII** — English, Mathematics, Physics, Chemistry and Biology.

**Live site:** _(enable GitHub Pages — see below — and the URL appears here)_

Class 11 and 12 under the CISCE board follow the **ISC** syllabus. (ICSE is Classes 9–10.)

## What's inside

| | |
|---|---|
| Subjects | English (101), Mathematics (860), Physics (861), Chemistry (862), Biology (863) |
| Chapters | 75 across both years |
| Syllabus topics | 447, mapped unit by unit with official mark weightings |
| Model answers | 231 board-style questions with full written answers |
| Formula / key-fact cards | 424 |
| Concept notes | Every chapter, plus a "watch out" list of the mistakes examiners see most |

## The five screens

- **Home** — progress at a glance, subject cards, and one box to ask anything.
- **Course** — the full ISC syllabus, unit by unit, with a tick box for every chapter.
- **Ask** — type a doubt in plain English ("why is endosperm 3n", "derive escape velocity", "Lady Macbeth character") and get the matching concept, formula or model answer, ranked. Filter by subject.
- **Revise** — shuffled flashcards built from every concept and formula in the selected subject and year. Space bar flips, arrow key advances.
- **Plan** — enter the exam date and it turns the chapters still unticked into a week-by-week revision plan that rotates subjects instead of blocking them.

Progress is stored in the browser (`localStorage`), so it stays on her own device and needs no login. Once the page has loaded, everything works **offline** — useful on a patchy connection or a train.

## Publish it on GitHub Pages

1. Push this folder to a GitHub repository.
2. Repository → **Settings** → **Pages**.
3. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**, then **Save**.
4. Wait about a minute. The site is live at `https://<your-username>.github.io/<repo-name>/`.

No build step, no dependencies, no server code — it is plain HTML, CSS and JavaScript.

## Adding or editing content

Everything lives in five plain JavaScript files under `data/`. Each chapter is one object:

```js
{
  id:'p12-1',                     // must be unique — progress ticks are keyed on it
  unit:1,
  name:'Electrostatics',
  marks:'14 (with Current Electricity)',
  topics:  ['…'],                                  // syllabus points
  concepts:[{t:'Coulomb\'s law', d:'…'}],          // explanations
  formulas:[{f:'F = kq₁q₂/r²', m:'what it means'}],// also used for flashcards
  mistakes:['…'],                                  // the "watch out" tab
  questions:[{marks:3, q:'…', a:'…'}]              // model answers
}
```

Add to any array and it appears in the app, in search, and in the flashcard deck automatically. No rebuild needed — just save and refresh.

## A note on accuracy

The syllabus structure and mark weightings follow the CISCE ISC syllabus for 2026–27. **Prescribed literature texts are revised periodically by CISCE** — confirm the exact short stories and poems for the current year against the school's own list before relying on the English Class XI selections.

## Licence

MIT for the code. The study content is original explanatory writing prepared for this repository.
