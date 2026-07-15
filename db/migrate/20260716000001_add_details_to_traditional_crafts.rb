class AddDetailsToTraditionalCrafts < ActiveRecord::Migration[7.2]
  def change
    change_table :traditional_crafts, bulk: true do |t|
      t.integer :designated_year
      t.string :production_area, limit: 50
      t.string :image_path
      t.string :source_url
    end
  end
end
