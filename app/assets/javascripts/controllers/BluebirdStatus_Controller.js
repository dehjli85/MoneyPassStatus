//= require bluebird_status

BluebirdStatus.module("App", function(App, BluebirdStatus, Backbone, Marionette, $, _){
	
	App.Controller = {

		showIndex: function(){

			var indexLayoutView = new BluebirdStatus.IndexLayoutView();

			BluebirdStatus.rootView.mainRegion.show(indexLayoutView);		

		},

		search: function(indexLayoutView){

			ga('send', 'event', 'search', 'search', indexLayoutView.ui.searchInput.val());

			var getUrl = '/search?location=' + encodeURIComponent(indexLayoutView.ui.searchInput.val());

			var jqxhr = $.get(getUrl, function(){
				console.log('get search request...');
			})
			.done(function(data) {
				
				console.log(data);

				var collection = new Backbone.Collection(data.atms);

				var searchResultsCompositeView = new BluebirdStatus.App.SearchResultsCompositeView({collection: collection});
				indexLayoutView.resultsRegion.show(searchResultsCompositeView);				

				console.log(searchResultsCompositeView);
				
		  })
		  .fail(function() {
		  	console.log("error");
		  })
		  .always(function() {
		   
			});
			
		},

		openStatusModal: function(indexLayoutView, atmView){

			 var statusModal = new BluebirdStatus.App.StatusModalItemView({model: atmView.model});
			 indexLayoutView.modalRegion.show(statusModal);
			 indexLayoutView.ui.modalRegion.modal("show");

		},

		saveStatus: function(indexLayoutView, statusModalItemView){

			ga('send', 'event', 'update', 'update', statusModalItemView.model.get("state"));

			var postUrl = "/update";
			var jqxhr = $.post( postUrl, statusModalItemView.ui.atmStatusForm.serialize(), function(){
				
				console.log("post new status...");
			
			}).done(function(data){

				//close the modal
				indexLayoutView.ui.modalRegion.modal('hide');

				var model;
				//display whether it was saved correctly or not
				if(data.status == "success"){

					model = new Backbone.Model({
						alertClass: "alert-success",
						message: "Atm Status Successfully Saved!"
					});

				}
				else{

					model = new Backbone.Model({
						alertClass: "alert-danger",
						message: "There was an error saving the status update!"
					});

				}

				var alertView = new BluebirdStatus.App.AlertView({model: model});
				indexLayoutView.modalRegion.show(alertView);

				App.Controller.search(indexLayoutView);


			});	

			
				
		},

		geolocate: function(indexLayoutView){
			var postUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCMBF1nphE0DPU4Og-_KE4h8f4lhkGLqjc";
			var jqxhr = $.post( postUrl, {}, function(){
				
				console.log("post geolocation...");
			
			}).done(function(data){

				console.log(data);

				var lat = data.location.lat;
				var lng = data.location.lng;

				var postUrl2 = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyCMBF1nphE0DPU4Og-_KE4h8f4lhkGLqjc&result_type=postal_code";
				var jqxhr2 = $.post( postUrl2, {}, function(){
					
					console.log("post reverse geocoding...");
				
				}).done(function(data2){

					console.log(data2);

					var zipcode = data2.results[0].address_components[0].long_name;
					indexLayoutView.ui.searchInput.val(zipcode);


				});	

				


			});	
			
		},

		showFaqs: function(indexLayoutView){

			ga('send', 'event', 'faqs', 'faqs', '');

			var faqsView = new BluebirdStatus.App.FaqsView();

			indexLayoutView.resultsRegion.show(faqsView);

		}

		

	}	

});