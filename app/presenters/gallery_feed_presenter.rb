class GalleryFeedPresenter
  def self.build(galleries:, good_count:, my_good_ids:, id_method: :id)
    galleries.map do |g|
      id = g.public_send(id_method)
      {
        id:        id,
        dataUrl:   g.data.to_s,
        tags:      g.tag_list.to_a,
        goodCount: good_count[id] || 0,
        myGood:    my_good_ids.include?(id)
      }
    end
  end
end
