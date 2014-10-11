class CreateAtms < ActiveRecord::Migration
  def change
    create_table :atms do |t|
    	t.string :name
    	t.string :street
    	t.string :city
    	t.string :state
    	t.string :postalCode    	
    	t.boolean :isAvailable24Hours
      	t.timestamps
    end
  end
end
