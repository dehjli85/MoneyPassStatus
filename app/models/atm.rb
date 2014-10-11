class Atm < ActiveRecord::Base

	has_many :atm_statuses

	def most_recent_status
		max_date = DateTime.new(1900,1,1)
		max_id = 0
		max_status = nil
		self.atm_statuses.each do |status|
			if status.status_check_date > max_date
				max_date = status.status_check_date
				max_id = status.id
				max_status = status
			end
		end

		return max_status
	end

end
