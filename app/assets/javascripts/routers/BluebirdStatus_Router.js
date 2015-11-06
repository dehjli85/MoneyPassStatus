//= require bluebird_status
BluebirdStatus.module("App", function(App, BluebirdStatus, Backbone, Marionette, $, _){
	App.Router = Marionette.AppRouter.extend({
		appRoutes:{

		}		
	});

	var API = {
		showIndex: function(){
			console.log("route to home was triggered, showActionButtons");
			App.Controller.showActionButtons();			
			
		},

		
		
	};

	BluebirdStatus.on("index:home",function(){
		BluebirdStatus.navigate("home");
		API.showIndex();
	});

	BluebirdStatus.addInitializer(function(){
		new App.Router({
			controller: API
		});

		BluebirdStatus.rootView = new BluebirdStatus.App.LayoutView();
		BluebirdStatus.rootView.render();

	});
});

