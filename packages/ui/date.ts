// 誕生日（YYYY-MM-DD）から満年齢を求める。
// YYYYMMDD の整数どうしの差を 10000 で割ると、誕生日前なら 1 少なくなる。
export function calcAge(birthday: string): number {
  const fmt = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return Math.floor((fmt(new Date()) - fmt(new Date(birthday))) / 10000);
}

// 経過時間を「n分」「n時間」…「n年」の形にする。呼び出し側で「前」を付ける。
export function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}ヶ月`;
  return `${Math.floor(months / 12)}年`;
}
