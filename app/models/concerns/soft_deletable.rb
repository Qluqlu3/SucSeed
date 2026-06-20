module SoftDeletable
  extend ActiveSupport::Concern

  included do
    default_scope { where(deleted_at: nil) }
    scope :with_deleted, -> { unscoped }
    scope :only_deleted, -> { unscoped.where.not(deleted_at: nil) }
  end

  def soft_delete
    update_column(:deleted_at, Time.current)
  end

  def restore
    update_column(:deleted_at, nil)
  end

  def deleted?
    deleted_at.present?
  end
end
