# N+1 クエリの検出 (development / test のみ)。
#
# フィード系のクエリは QueryService に集約して includes を効かせているが、
# 「今 N+1 が無いこと」を保証する仕組みが無く、変更で再発しても気付けなかった。
#
# test では raise = true にして CI で落とす。development ではログと
# ブラウザのフッターに出すだけにして、開発の流れを止めない。
if defined?(Bullet) && Rails.env.local?
  Rails.application.config.after_initialize do
    Bullet.enable = true

    if Rails.env.test?
      # N+1 を作り込んだままマージされないよう例外にする。
      # 例外はミドルウェア層で送出されるためテスト側のメッセージが分かりにくいので、
      # 「どのモデルのどの関連か」が分かる Bullet のメッセージを log/test.log にも残す。
      Bullet.raise = true
      Bullet.rails_logger = true
    else
      Bullet.alert = false
      Bullet.bullet_logger = true
      Bullet.rails_logger = true
      Bullet.add_footer = true
    end

    # 「includes したが実際には使っていない」の検出は、
    # 一覧と詳細で同じ QueryService を共用している都合で誤検知が出るため無効化する。
    # 本命の N+1 検出 (unused_eager_loading ではなく n_plus_one_query) は有効のまま。
    Bullet.unused_eager_loading_enable = false
  end
end
