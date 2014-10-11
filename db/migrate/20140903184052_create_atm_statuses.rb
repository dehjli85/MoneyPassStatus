class CreateAtmStatuses < ActiveRecord::Migration
  def change
    create_table :atm_statuses do |t|
    	t.integer :money_order_status_id
    	t.string :money_order_status_description
    	t.integer :bluebird_status_id
    	t.string :bluebird_status_description
    	t.datetime :status_check_date
    	t.integer :atm_id
      	t.timestamps
    end
  end
end
