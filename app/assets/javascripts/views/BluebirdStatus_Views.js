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
				modalRegion: "#modal_region",
				faqsButton: "[ui-faqs-button]"
			},

			triggers:{
				"submit @ui.searchForm": "search",
				"click @ui.searchButton": "search"
			},

			events:{
				"click @ui.faqsButton": "showFaqs"
			},

			initialize: function(){
				App.Controller.geolocate(this);
			},

			onSearch: function(){

				if(this.ui.searchInput.val() != ""){
					BluebirdStatus.App.Controller.search(this);
				}

			},

			showFaqs: function(){
				App.Controller.showFaqs(this);
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
			iconLink: "[ui-icon-link]",
			commentLink: "[ui-comment-link]"
		},

		triggers:{
			"click @ui.iconLink": "open:status:modal",
			"click @ui.commentLink": "doNothing"
		},

		onShow: function(){
			$('[data-toggle="popover"]').popover()
		},

		doNothing: function(e){
			e.preventDefault();
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


			this.ui.statusCheckDateInput.val(moment(this.ui.datetimeInput.val()).utc().format());

			console.log(this.ui.statusCheckDateInput.val());

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

	App.FaqsView = Marionette.ItemView.extend({
		template: JST["templates/FaqsView"],

	})


});