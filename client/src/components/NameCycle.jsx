import { useEffect, useState } from 'react';

// "Arpit Kumar" in major world languages and scripts.
export const NAMES = [
  { text: 'अर्पित कुमार', lang: 'hi', label: 'Hindi' },
  { text: 'অর্পিত কুমার', lang: 'bn', label: 'Bengali' },
  { text: 'アルピト・クマール', lang: 'ja', label: 'Japanese' },
  { text: 'அர்பித் குமார்', lang: 'ta', label: 'Tamil' },
  { text: 'أربيت كومار', lang: 'ar', label: 'Arabic', rtl: true },
  { text: '아르핏 쿠마르', lang: 'ko', label: 'Korean' },
  { text: 'అర్పిత్ కుమార్', lang: 'te', label: 'Telugu' },
  { text: 'Арпит Кумар', lang: 'ru', label: 'Russian' },
  { text: 'ਅਰਪਿਤ ਕੁਮਾਰ', lang: 'pa', label: 'Punjabi' },
  { text: '阿尔皮特·库马尔', lang: 'zh', label: 'Chinese' },
  { text: 'અર્પિત કુમાર', lang: 'gu', label: 'Gujarati' },
  { text: 'Άρπιτ Κουμάρ', lang: 'el', label: 'Greek' },
  { text: 'ارپت کمار', lang: 'ur', label: 'Urdu', rtl: true },
  { text: 'ಅರ್ಪಿತ್ ಕುಮಾರ್', lang: 'kn', label: 'Kannada' },
  { text: 'ארפיט קומאר', lang: 'he', label: 'Hebrew', rtl: true },
  { text: 'അർപ്പിത് കുമാർ', lang: 'ml', label: 'Malayalam' },
  { text: 'อาร์พิต กุมาร', lang: 'th', label: 'Thai' },
];

// Split into user-perceived characters so combining marks (e.g. Devanagari matras) stay attached.
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
const graphemes = (s) => (seg ? [...seg.segment(s)].map((x) => x.segment) : Array.from(s));

const TYPE_MS = 90;
const ERASE_MS = 45;
const HOLD_MS = 1700;

export default function NameCycle() {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(() => graphemes(NAMES[0].text).length);
  const [phase, setPhase] = useState('hold'); // typing | hold | erasing
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const parts = graphemes(NAMES[idx].text);

  useEffect(() => {
    if (reduce) {
      // no typing: just swap whole names slowly
      const t = setTimeout(() => setIdx((i) => (i + 1) % NAMES.length), 3200);
      return () => clearTimeout(t);
    }
    let t;
    if (phase === 'typing') {
      if (count < parts.length) t = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
      else t = setTimeout(() => setPhase('hold'), 0);
    } else if (phase === 'hold') {
      t = setTimeout(() => setPhase('erasing'), HOLD_MS);
    } else if (count > 0) {
      t = setTimeout(() => setCount((c) => c - 1), ERASE_MS);
    } else {
      t = setTimeout(() => { setIdx((i) => (i + 1) % NAMES.length); setPhase('typing'); }, 220);
    }
    return () => clearTimeout(t);
  }, [phase, count, parts.length, reduce]);

  const n = NAMES[idx];
  const shown = reduce ? n.text : parts.slice(0, count).join('');

  return (
    <p className="name-cycle" aria-hidden="true">
      <span className="nc-text" lang={n.lang} dir={n.rtl ? 'rtl' : 'ltr'}>
        {shown}
        <i className={`nc-caret ${phase === 'hold' ? 'blink' : ''}`} />
      </span>
      <span className={`nc-label ${count > 0 || reduce ? 'on' : ''}`} key={n.lang}>{n.label}</span>
    </p>
  );
}
