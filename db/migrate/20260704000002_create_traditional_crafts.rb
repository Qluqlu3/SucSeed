class CreateTraditionalCrafts < ActiveRecord::Migration[7.2]
  def change
    create_table :traditional_crafts do |t|
      t.string :name, null: false, limit: 50
      t.integer :prefecture_code, null: false
      t.references :art_category, null: true, foreign_key: true
      t.text :summary, null: false
      t.text :features, null: false

      t.timestamps
    end
    add_index :traditional_crafts, :prefecture_code
  end
end
