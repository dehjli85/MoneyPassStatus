class MoneyPassController < ApplicationController

	respond_to :json

	def index

	end

	def update

		#find the ATM in the database
		puts params

    atm_status = AtmStatus.new(params.require(:atm_status).permit(:atm_id, :working, :status_check_date))    
    puts params[:atm_status][:status_check_date]
	  #   puts params[:atm_status][:date]
	  #   puts params[:atm_status][:time]

			
			# d = Date.parse(params[:atm_status][:date])
			# t = Time.parse(params[:atm_status][:time])
			# atm_status.status_check_date = DateTime.new(d.year, d.month, d.day, t.hour, t.min)
			
		# puts atm_status.status_check_date
		
		if atm_status.save
			render json: {status: "success"}
		else
			render json: {status: "error"}
		end

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

		atms = Atm.find(locationHash.keys).as_json

		render json: {atms: atms}

		#check the latest status of the ATM
		#respond_with(Atm.find(locationHash.keys))
	end

	def view_history

		

		

	end
end
