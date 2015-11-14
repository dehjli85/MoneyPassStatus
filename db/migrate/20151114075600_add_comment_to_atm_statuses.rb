class AddCommentToAtmStatuses < ActiveRecord::Migration
  def change
  	add_column :atm_statuses, :comment, :string
  end
end
