class CreateAtmStatuses < ActiveRecord::Migration
  def change
    create_table :atm_statuses do |t|
      t.integer :atm_id
      t.datetime :status_check_date
      t.boolean :working
      t.timestamps
    	
    	
    end
  end
end
