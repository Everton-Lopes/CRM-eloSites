const UNITS = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
];
const TEENS = [
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
];
const TENS = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
];
const HUNDREDS = [
  '',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos',
];

function under1000(n: number): string {
  if (n === 100) return 'cem';
  const c = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (c > 0) parts.push(HUNDREDS[c]);
  if (r > 0) {
    if (r < 10) {
      parts.push(UNITS[r]);
    } else if (r < 20) {
      parts.push(TEENS[r - 10]);
    } else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      parts.push(u === 0 ? TENS[d] : `${TENS[d]} e ${UNITS[u]}`);
    }
  }
  return parts.join(' e ');
}

function highWords(high: number): string {
  return high < 1000 ? under1000(high) : integerToWords(high);
}

function groupWithSuffix(
  high: number,
  low: number,
  singular: string,
  plural: string,
): string {
  const head = high === 1 ? singular : `${highWords(high)} ${plural}`;
  if (low === 0) return head;
  return `${head} e ${integerToWords(low)}`;
}

function integerToWords(n: number): string {
  if (n === 0) return 'zero';
  if (n < 1_000) return under1000(n);

  if (n < 1_000_000) {
    return groupWithSuffix(Math.floor(n / 1_000), n % 1_000, 'mil', 'mil');
  }

  if (n < 1_000_000_000) {
    return groupWithSuffix(
      Math.floor(n / 1_000_000),
      n % 1_000_000,
      'um milhão',
      'milhões',
    );
  }

  return groupWithSuffix(
    Math.floor(n / 1_000_000_000),
    n % 1_000_000_000,
    'um bilhão',
    'bilhões',
  );
}

export function valorPorExtenso(value: number | null | undefined): string {
  if (value === null || value === undefined || !isFinite(Number(value))) return '';
  const abs = Math.abs(Number(value));
  const reais = Math.floor(abs);
  const centavos = Math.round((abs - reais) * 100);
  const reaisLabel = reais === 1 ? 'real' : 'reais';
  let text = `${integerToWords(reais)} ${reaisLabel}`;
  if (centavos > 0) {
    const centLabel = centavos === 1 ? 'centavo' : 'centavos';
    text += ` e ${integerToWords(centavos)} ${centLabel}`;
  }
  return text;
}
