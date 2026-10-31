require 'test_helper'

class ApplicationHelperTest < ActionView::TestCase
  test 'react_root は props を JSON にして data-props 属性に入れ、属性値をエスケープする' do
    html = react_root('x-page', { name: %(O"Brien <script>alert(1)</script> & 'x') })

    assert_equal 'x-page', Nokogiri::HTML(html).at_css('div')['id']
    assert_equal({ 'name' => %(O"Brien <script>alert(1)</script> & 'x') },
                 JSON.parse(Nokogiri::HTML(html).at_css('div')['data-props']))
    assert_not_includes html, '<script>'
  end

  test 'react_root は props を渡さなければ data-props 属性を出さない' do
    assert_equal '<div id="x-page"></div>', react_root('x-page')
  end
end
