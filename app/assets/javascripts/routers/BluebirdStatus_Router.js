//= require bluebird_status
BluebirdStatus.module("App", function(App, BluebirdStatus, Backbone, Marionette, $, _){
	App.Router = Marionette.AppRouter.extend({
		appRoutes:{

		}		
	});

	var API = {
		

		
		
	};

	
	BluebirdStatus.addInitializer(function(){
		new App.Router({
			controller: API
		});

		BluebirdStatus.rootView = new BluebirdStatus.App.LayoutView();
		BluebirdStatus.rootView.render();

	});
});

