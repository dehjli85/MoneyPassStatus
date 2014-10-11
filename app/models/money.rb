class Money

	require 'net/http'
	require 'cgi'
	require 'rexml/document'
	require 'json'

	def self.getATMs(searchTerm)


		#make the http request to moneypass site to get credentials
		uri = URI('http://atmlocator.moneypass.com/InitializeSettings.ashx')
		http = Net::HTTP.new(uri.host, uri.port)
		req = Net::HTTP::Get.new('http://atmlocator.moneypass.com/InitializeSettings.ashx')
		http.start
		res = http.request(req)

		#parse response to get the security key
		sessionKeyMatches = res.body.match(/\"apiKey\":\"(\w+)\"/)
		sessionKey = sessionKeyMatches[1]
		apiKeyMatches = res.body.match(/\"key\":\"([\w|-]*)\"/)
		apiKey = apiKeyMatches[1]

		#close the connection
		http.finish

		######query for geolocation
		#set the geolocation URL
		geoLocUrl = 'http://dev.virtualearth.net/REST/v1/Locations/?'
		geoLocUrl += 'key=' + apiKey
		geoLocUrl += '&includeNeighborhood=1'
		geoLocUrl += '&q=' + URI::encode(searchTerm.to_s)
		geoLocUrl += '&maxResults=25'
		geoLocUrl += '&filter=%5B%7B%7D%2C%7B%7D%2C%7B%7D%5D'

		#make the http request
		uri = URI(geoLocUrl)
		http = Net::HTTP.new(uri.host, uri.port)
		req = Net::HTTP::Get.new(geoLocUrl)
		http.start
		res = http.request(req)
		
		#parse the result
		json_result = JSON.parse(res.body)
		puts json_result
		resourceSets = json_result['resourceSets']
		resources =  resourceSets[0]['resources']
		latitude = resources[0]['point']['coordinates'][0]
		longitude = resources[0]['point']['coordinates'][1]	
		puts 'Latitude: ' + latitude.to_s + ', Longitude: ' + longitude.to_s

		#close the connection
		http.finish

		######query for moneypass locations
		#set the moneypass API URL
		moneypassAPIurl = 'https://locatorapi.moneypass.com/Service.svc/locations/atm?'
		moneypassAPIurl += '_dc=1409595874934'
		moneypassAPIurl += '&format=json'
		moneypassAPIurl += '&key=' + sessionKey
		moneypassAPIurl += '&spatialFilter=nearby(' + latitude.to_s + '%2C' + longitude.to_s + '%2C100)'
		moneypassAPIurl += '&filter=(SearchDBAName%20%3D%20%27WALMART%27)'
		moneypassAPIurl += '&start=0'
		moneypassAPIurl += '&count=7'	
		#puts moneypassAPIurl

		#make the https request
		moneypassURI = URI(moneypassAPIurl)	
		http = Net::HTTP.new(moneypassURI.host, moneypassURI.port)
		req = Net::HTTP::Get.new(moneypassAPIurl)
		http.use_ssl = true
		http.start
		res = http.request(req)

		#parse the result
		json_result = JSON.parse(res.body)
		results = json_result['results']
		atmsHash = Hash.new
		results.each do |location|
			atm = Hash.new		
			atmLocation = location['atmLocation']
			atm[:id] = atmLocation['id']
			address = atmLocation['address']
			atm[:street] = address['street']
			atm[:city] = address['city']
			atm[:state] = address['state']
			atm[:postalCode] = address['postalCode']		
			atm[:name] = atmLocation['name']
			atm[:isAvailable24Hours] = atmLocation['isAvailable24Hours']
			atmsHash[atm[:id]] = atm
		end

		return atmsHash

	end	
end
