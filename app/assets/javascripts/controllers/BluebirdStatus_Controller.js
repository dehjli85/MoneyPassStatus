//= require bluebird_status

BluebirdStatus.module("App", function(App, BluebirdStatus, Backbone, Marionette, $, _){
	
	App.Controller = {

		showIndex: function(){

			var indexLayoutView = new BluebirdStatus.IndexLayoutView();

			BluebirdStatus.rootView.mainRegion.show(indexLayoutView);		

		},

		search: function(indexLayoutView){
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
				
				// obj.displayResults();
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

			
				
		}

		

	}	

});