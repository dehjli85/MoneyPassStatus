BluebirdStatus = new Marionette.Application()

BluebirdStatus.navigate = function(route, options){
	options || (options = {});
	Backbone.history.navigate(route, options);

	if(BluebirdStatus.rootView.alertRegion){
		BluebirdStatus.rootView.alertRegion.empty();
	}
};

BluebirdStatus.getCurrentRoute = function(){
	return Backbone.history.fragment;
};

BluebirdStatus.on("start", function(){		

	if(!Backbone.History.started){
		Backbone.history.start();

		if(this.getCurrentRoute() === ""){
			BluebirdStatus.trigger("index:home");			
		}
	};


});

