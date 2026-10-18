// esbuild の file loader（package.json の --loader:.png=file など）で取り込む画像。
// import すると `/assets/<name>-<hash>.digested.<ext>` という配信パスの文字列になる。
// `.digested` 付きの名前は Propshaft が二重にダイジェストを付けずにそのまま配信する。
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}
