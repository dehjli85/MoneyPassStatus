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
		locationv = Money.getATMs(params[:location])		

		ids = Array.new

		#for any ATMs not in the database, add them
		locationv.each do |k,v|
			if(!Atm.exists?(v))
				newAtm = Atm.new
				newAtm.id = Atm.max_id + 1
				newAtm.street = v[:street]
				newAtm.city = v[:city]
				newAtm.state = v[:state]
				newAtm.postalCode = v[:postalCode]
				newAtm.name = v[:name]
				newAtm.isAvailable24Hours = v[:isAvailable24Hours]
				newAtm.save
				ids.push(newAtm.id)
			else
				existingAtm = Atm.where({street: v[:street], city: v[:city], state: v[:state], postalCode: v[:postalCode]}).first
				ids.push(existingAtm.id)
			end

		end

		atms = Atm.find(ids).as_json

		render json: {atms: atms}

		#check the latest status of the ATM
		#respond_with(Atm.find(locationv.keys))
	end

	def view_history

		

		

	end
end
