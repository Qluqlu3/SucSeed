# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
ArtCategory.create(name: '染織物')
ArtCategory.create(name: '陶磁器')
ArtCategory.create(name: '漆器')
ArtCategory.create(name: '木工')
ArtCategory.create(name: '竹工品')
ArtCategory.create(name: '金工品')
ArtCategory.create(name: '文具')
ArtCategory.create(name: '和紙')
ArtCategory.create(name: 'その他')

InquiryCategory.create!(name: 'トラブル')
InquiryCategory.create(name: '質問')
InquiryCategory.create(name: '不具合')
InquiryCategory.create(name: '要望')
InquiryCategory.create(name: 'その他')
