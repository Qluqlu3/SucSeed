require 'test_helper'

class InquiryControllerTest < ActionDispatch::IntegrationTest
  test "should get input_page" do
    get '/inquiry/input'
    assert_response :success
  end
end
