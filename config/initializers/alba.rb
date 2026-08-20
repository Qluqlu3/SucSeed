# Alba (JSON シリアライザ) のグローバル設定。
#
# inflector: transform_keys :lower_camel を使うために必要。ActiveSupport の
#            camelize(:lower) を利用する。
# backend:   Alba#to_json の実装。ActiveSupport の JSON エンコーダを使うことで
#            Time / Date / BigDecimal の表現が Rails の render json: と一致する。
Alba.inflector = :active_support
Alba.backend = :active_support
