class GalleryUploader < CarrierWave::Uploader::Base
  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/galleries/#{model.id}"
  end

  def size_range
    1..(5.megabytes)
  end

  # Process files as they are uploaded:
  # process scale: [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end
  def filename
    "#{secure_token}.#{file.extension}" if original_filename.present?
  end

  def extension_allowlist
    %w[jpg jpeg png]
  end

  # 拡張子偽装対策: マジックバイトから判定した実際のcontent_typeも検証する
  def content_type_allowlist
    %w[image/jpeg image/png]
  end

  protected

  def secure_token
    var = :"@#{mounted_as}_secure_token"
    model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.uuid)
  end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process resize_to_fit: [50, 50]
  # end
end
