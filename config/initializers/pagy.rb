# frozen_string_literal: true

# Pagy 43(次世代版)の設定。
# https://ddnexus.github.io/pagy/toolbox/configuration/initializer/
#
# 9.x -> 43.x はAPIの完全な再設計を伴うメジャーアップグレード。
# 本アプリでの変更点は次の3つだけ(pagy(scope, limit: N) の呼び出し自体は
# 互換のまま使える):
#   - include Pagy::Backend  -> include Pagy::Method
#   - Pagy::OverflowError    -> Pagy::RangeError
#   - デフォルトの挙動が「範囲外ページは例外を投げる」から
#     「範囲外ページは静かに空ページを返す」に変わったため、
#     従来どおり例外を発生させるには :raise_range_error が必要

# 旧バージョンでの標準動作(範囲外ページで Pagy::RangeError を送出する)を維持する。
# ApplicationController#render_pagy_overflow と
# Api::BaseController#render_page_out_of_range がこれを rescue_from で捕捉する。
Pagy::OPTIONS[:raise_range_error] = true

Pagy::OPTIONS.freeze
