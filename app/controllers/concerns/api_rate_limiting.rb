# ログイン中ユーザー単位のレート制限（Rails 8 の ActionController::RateLimiting を使う）。
#
# Rack::Attack は IP 単位で数えているため、次の2つの穴がある。
#
#   - 同じ NAT/プロキシの裏にいる無関係な利用者と枠を共有してしまう（誤検知）
#   - 逆に IP を変えられると1人でいくらでも投稿できる（検知漏れ）
#
# そこで「IP 単位（Rack::Attack）」と「ユーザー単位（ここ）」を重ねて両方を塞ぐ。
# どちらか一方でも超えたら 429 になる。
#
# カウンタは Rails.cache に載る。cache_store がプロセスローカルな実装
# （:memory_store や :file_store）だと、アプリを複数プロセス/複数インスタンスで
# 動かした際にインスタンスごとに別カウントになり、実効上限が台数倍になる点に注意。
module ApiRateLimiting
  extend ActiveSupport::Concern

  class_methods do
    # 未ログインでも到達しうるアクションのために、ユーザーIDが無ければ IP で数える。
    def rate_limit_per_user(to:, within:, **options)
      rate_limit to: to, within: within,
                 by: -> { Current.user_id || request.remote_ip },
                 with: -> { render_rate_limited },
                 **options
    end
  end

  private

  def render_rate_limited
    render_error('too_many_requests',
                 'リクエストが多すぎます。しばらく待ってから再度お試しください',
                 status: :too_many_requests)
  end
end
