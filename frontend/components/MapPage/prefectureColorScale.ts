// 職人の件数を紫の濃淡(sequential scale)にマッピングする。
// サイト共通トークン(p-pale→p-dark)が明度順に並んでいるため、
// 件数の少 → 多 をそのまま薄い紫 → 濃い紫の階調として再利用する。
// データが無い(0件)は紫の一番薄い色と混同しないよう中立グレーにする。
export interface ColorBucket {
  label: string;
  color: string;
  minCount: number;
}

export const COLOR_BUCKETS: ColorBucket[] = [
  { label: '0件', color: '#e2e0e6', minCount: 0 },
  { label: '1件', color: 'var(--color-p-light)', minCount: 1 },
  { label: '2〜3件', color: 'var(--color-p-mid)', minCount: 2 },
  { label: '4〜6件', color: 'var(--color-p-muted)', minCount: 4 },
  { label: '7件以上', color: 'var(--color-p-brand)', minCount: 7 },
];

export const colorForCount = (count: number): string => {
  let color = COLOR_BUCKETS[0].color;
  for (const bucket of COLOR_BUCKETS) {
    if (count >= bucket.minCount) color = bucket.color;
  }
  return color;
};
