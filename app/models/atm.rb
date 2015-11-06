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

end
