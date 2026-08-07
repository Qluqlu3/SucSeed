class GalleryFeedPresenter
  def self.build(galleries:, good_count:, my_good_ids:)
    galleries.map do |g|
      id = g.id
      {
        id: id,
        dataUrl: g.data.to_s,
        tags: g.tag_list.to_a,
        goodCount: good_count[id] || 0,
        myGood: my_good_ids.include?(id),
      }
    end
  end
end
