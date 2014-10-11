class MoneyPassController < ApplicationController

	respond_to :json

	def index

	end

	def update

		#find the ATM in the database
		puts params

		newAtmStatus = AtmStatus.new
		newAtmStatus.atm_id = params[:atmId]
		newAtmStatus.bluebird_status_id = params[:bluebirdStatus]
		newAtmStatus.money_order_status_id = params[:moneyOrderStatus]
		case newAtmStatus.bluebird_status_id
		when 1
			newAtmStatus.bluebird_status_description = "OK"
		when 2
			newAtmStatus.bluebird_status_description = "Not Working"
		when 0
			newAtmStatus.bluebird_status_description = "Unknown"
		end
		case newAtmStatus.money_order_status_id
		when 1
			newAtmStatus.money_order_status_description = "OK"
		when 2
			newAtmStatus.money_order_status_description = "Not Working"
		when 0
			newAtmStatus.money_order_status_description = "Unknown"
		end

		d = Date.parse(params[:inputDate])
		t = Time.parse(params[:inputTime])
		newAtmStatus.status_check_date = DateTime.new(d.year, d.month, d.day, t.hour, t.min)
		

		return_hash = Hash.new
		if(newAtmStatus.save)
			return_hash[:status] = 'ok'
		else
			return_hash[:status] = 'fail'
		end
		
		
		render json: return_hash
	end

	def search
		#puts "SEARCH!!"
		
		#query the money pass atm website		
		locationHash = Money.getATMs(params[:location])		

		#for any ATMs not in the database, add them
		locationHash.each do |k,v|
			if(!Atm.exists?(k))
				newAtm = Atm.new
				newAtm.id = v[:id]
				newAtm.street = v[:street]
				newAtm.city = v[:city]
				newAtm.state = v[:state]
				newAtm.postalCode = v[:postalCode]
				newAtm.name = v[:name]
				newAtm.isAvailable24Hours = v[:isAvailable24Hours]
				newAtm.save
			end
		end

		atms = Atm.find(locationHash.keys)
		status_hash = Hash.new
		atms.each do |atm|
			status_hash[atm.id] = atm.most_recent_status
		end

		return_hash = Hash.new
		return_hash[:atms] = atms
		return_hash[:statuses] = status_hash		
		render json: return_hash

		#check the latest status of the ATM
		#respond_with(Atm.find(locationHash.keys))
	end

	def view_history

		

		

	end
end
