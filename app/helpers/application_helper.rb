module ApplicationHelper
  # React で描く画面のマウント先（frontend/pages.ts の登録表と id で対応する）。
  # props は JSON にして data-props 属性に入れる。属性値のエスケープは tag ヘルパーに任せ、
  # JSON を手で ERB に埋め込まない（<%== や raw に変えた途端に XSS になるため）。
  # props を渡さない画面では data-props 属性ごと出さない。
  def react_root(id, props = nil)
    tag.div(id: id, data: { props: props&.to_json })
  end
end
