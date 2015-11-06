//= require bluebird_status

BluebirdStatus.module("App", function(App, BluebirdStatus, Backbone, Marionette, $, _){
	
	App.LayoutView = Marionette.LayoutView.extend({				
			template: JST["templates/IndexLayoutView"],
			el:"#bluebird_status_region",

			regions:{
				headerRegion: "#header_region",
				alertRegion: "#alert_region",
				searchRegion: "#search_region",
				resultsRegion: "#results_region",
				modalRegion: "#modal_region"
			},

			ui:{
				searchForm: "[ui-search-form]",
				searchInput: "[ui-search-input]",
				searchButton: "[ui-search-button]",
				modalRegion: "#modal_region"
			},

			triggers:{
				"submit @ui.searchForm": "search",
				"click @ui.searchButton": "search"
			},

			events:{
			},

			initialize: function(){
				App.Controller.geolocate(this);
			},

			onSearch: function(){

				if(this.ui.searchInput.val() != ""){
					BluebirdStatus.App.Controller.search(this);
				}

			},

			onChildviewOpenStatusModal: function(atmView){

				BluebirdStatus.App.Controller.openStatusModal(this, atmView);

			},

			onChildviewSaveAtmStatus: function(statusModalItemView){

				BluebirdStatus.App.Controller.saveStatus(this, statusModalItemView)
			}

	});

	App.AtmView = Marionette.ItemView.extend({
		template: JST["templates/AtmView"],
		tagName: "tr",

		ui:{
			iconLink: "[ui-icon-link]"
		},

		triggers:{
			"click @ui.iconLink": "open:status:modal"
		}

	});

	App.SearchResultsCompositeView = Marionette.CompositeView.extend({
		template: JST["templates/SearchResultsCompositeView"],
		childView: App.AtmView,
		childViewContainer: "tbody",

	});

	App.StatusModalItemView = Marionette.ItemView.extend({
		template: JST["templates/StatusModalItemView"],
		className: "modal-dialog",
		
		ui:{
			saveButton: "[ui-save-button]",
			atmStatusForm: "[ui-atm-status-form]",
			datetimeInput: "[ui-datetime-input]",
			statusCheckDateInput: "[ui-status-check-date-input]"
		},

		events:{
			"click @ui.saveButton": "saveAtmStatus"
		},

		saveAtmStatus: function(e){
			
			e.preventDefault();

			console.log(this.ui.datetimeInput.val());

			this.ui.statusCheckDateInput.val(moment(this.ui.datetimeInput.val()).utc().format());

			this.triggerMethod("save:atm:status");

		}

	});

	App.AlertView = Marionette.ItemView.extend({
		template: JST["templates/AlertView"],
		className: "alert center",

		initialize: function(){
			this.$el.addClass(this.model.get("alertClass"));
		}
	});


});