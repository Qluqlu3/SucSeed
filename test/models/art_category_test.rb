require 'test_helper'

class ArtCategoryTest < ActiveSupport::TestCase
  test 'ArtCategory save' do
    art_category = ArtCategory.new(
      id: 1,
      name: '金製品'
    )
    assert art_category.save, 'Succeeded to save'
  end
end
