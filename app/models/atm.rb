class Atm < ActiveRecord::Base

	has_many :atm_statuses, -> {order 'status_check_date DESC'}

	after_find :set_pretty_properties

	def set_pretty_properties
		@most_recent_status = self.atm_statuses[0]
	end 

	def most_recent_status
		@most_recent_status
	end

	def as_json(options = { })
      # just in case someone says as_json(nil) and bypasses
      # our default...
      super((options || { }).merge({
          :methods => [:most_recent_status]
      }))
  end

  def self.max_id
		max = Atm.all.pluck(:id).max.nil? ? 0 : Atm.all.pluck(:id).max

		return max
  end

  def self.exists?(hash)
  	if Atm.where({street: hash[:street], city: hash[:city], state: hash[:state], postalCode: hash[:postalCode]}).first.nil?
  		return false
  	else
  		return true
  	end
  end

end
