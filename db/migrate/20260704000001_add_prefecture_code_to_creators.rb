class AddPrefectureCodeToCreators < ActiveRecord::Migration[7.2]
  def change
    add_column :creators, :prefecture_code, :integer
    add_index :creators, :prefecture_code
  end
end
