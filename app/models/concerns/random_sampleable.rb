# ORDER BY RAND() はインデックスが使えずフルテーブルスキャン+一時テーブルを要するため
# レコード増加でスケールしない。idだけをpluckしてRuby側でサンプリングしてから絞り込む。
module RandomSampleable
  extend ActiveSupport::Concern

  class_methods do
    def random_sample(limit)
      sampled_ids = pluck("#{table_name}.#{primary_key}").sample(limit)
      where(primary_key => sampled_ids)
    end
  end
end
