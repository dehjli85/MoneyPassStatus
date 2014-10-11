/**
 * @author Dennis Li
 */
function AtmSearcher(searchForm, searchBox, searchButton, resultsDiv, alertDiv){
	
	//set the basics
	this.searchForm = $('#' + searchForm);
	this.searchBox = $('#' + searchBox);
	this.searchButton = $('#' + searchButton);
	this.resultsDiv = $('#' + resultsDiv);
	this.alertDiv = $('#' + alertDiv);

	//create the modal dialog for updating
	this.modal = $('<div class="modal fade" id="updateModal"></div>');
	this.modalDialog = $('<div class="modal-dialog"></div>');
	this.modalDialog.appendTo(this.modal);
	this.modalContent = $('<div class="modal-content"></div>');
	this.modalContent.appendTo(this.modalDialog);
	this.modalHeader = $('<div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div>');
	this.modalTitle = $('<h4 class="modal-title">Status Update</h4>');
	this.modalTitle.appendTo(this.modalHeader);
	this.modalHeader.appendTo(this.modalContent);
	this.modalBody = $('<div class="modal-body"></div>');
	this.modalBody.appendTo(this.modalContent);
	this.modalFooter = $('<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="updateButton">Save changes</button></div>');
	this.modalFooter.appendTo(this.modalContent);

	this.modal.appendTo("body");

	this.updateButton = $('#updateButton');
	this.updateButton.click(function(){obj.update()});

	var obj = this;

	//set the action for the search button and form submission
	this.searchForm.submit(function(event){obj.search();
	 event.preventDefault();});
	this.searchButton.click(function(){obj.search()});

}

AtmSearcher.prototype.search = function(){	

	var obj = this;

	obj.alertDiv.html("");

	//make ajax request
	if(this.searchBox.val() != ""){
		$.get('/search?location=' + encodeURIComponent(obj.searchBox.val()), function(data){
			obj.results = data;
			obj.displayResults();
			console.log(data);
		})
	}

}

AtmSearcher.prototype.update = function(){

	var obj = this;
	console.log("updating...");
	$.post( "/update", this.modalForm.serialize(), function(data){
		obj.updateStatus = data.status;

		//close the modal
		obj.modal.modal('hide');

		//display whether it was saved correctly or not
		if(obj.updateStatus == "ok"){
			obj.alertMessage = $('<div class="alert alert-success" role="alert">Atm Status Successfully Saved!</div>')
		}else{
			obj.alertMessage = $('<div class="alert alert-danger" role="alert">There was an error saving the status update!</div>')
		}
		obj.alertDiv.html("");
		obj.alertMessage.appendTo(obj.alertDiv);
	});
	
}

AtmSearcher.prototype.displayResults = function(){

	var obj = this;

	this.resultsDiv.html("");

	//create the HTML from the javascript object
	var table = $('<table></table>');
	table.attr("class","table table-bordered table-hover");
	table.attr("style","margin:20px 0px 0px 0px;");
	var header = $('<tr></tr>')
	//var td1 = $('<th class="col-md-2">Name</th>')
	var td2 = $('<th class="col-md-3">Address</th>')
	var td3 = $('<th class="col-md-6">Most Recent Status</th>')
	var td4 = $('<th class="col-md-3">Last Status Check</th>')
	//td1.appendTo(header);
	td2.appendTo(header);
	td3.appendTo(header);
	td4.appendTo(header);
	header.appendTo(table);

	for (var i = 0; i < this.results.atms.length; i++){
		var row = $('<tr></tr>');
		//var tdName = $('<td>' + this.results.atms[i].name + '</td>');
		var tdAddress = $('<td><address><strong>' + this.results.atms[i].name + '</strong><br>' + this.results.atms[i].street + '<br>' + this.results.atms[i].city  + ', ' + this.results.atms[i].state + ' ' + this.results.atms[i].postalCode + '<br></address></td>');
		

		var status = 'Money Orders: ';
		if(this.results.statuses[this.results.atms[i].id] != null){
			if(this.results.statuses[this.results.atms[i].id].money_order_status_description == 'OK'){
				status += '<span class="label label-success">' + this.results.statuses[this.results.atms[i].id].money_order_status_description + '</span>';	
			}
			else if(this.results.statuses[this.results.atms[i].id].money_order_status_description == 'Not Working'){
				status += '<span class="label label-danger">' + this.results.statuses[this.results.atms[i].id].money_order_status_description + '</span>';	
			}
			else if(this.results.statuses[this.results.atms[i].id].money_order_status_description == 'Unknown'){
				status += '<span class="label label-default">' + this.results.statuses[this.results.atms[i].id].money_order_status_description + '</span>';	
			}
			status += '<br/>Bluebird Load: ';
			if(this.results.statuses[this.results.atms[i].id].bluebird_status_description == 'OK'){
				status += '<span class="label label-success">' + this.results.statuses[this.results.atms[i].id].bluebird_status_description + '</span>';	
			}
			else if(this.results.statuses[this.results.atms[i].id].bluebird_status_description == 'Not Working'){
				status += '<span class="label label-danger">' + this.results.statuses[this.results.atms[i].id].bluebird_status_description + '</span>';	
			}		
			else if(this.results.statuses[this.results.atms[i].id].bluebird_status_description == 'Unknown'){
				status += '<span class="label label-default">' + this.results.statuses[this.results.atms[i].id].bluebird_status_description + '</span>';	
			}		
		}
		else{
			status += '<span class="label label-default">No Status Check</span>';	
			status += '<br/>Bluebird Load: ';
			status += '<span class="label label-default">No Status Check</span>';	
		}
		
		/*status +=  this.results.statuses[this.results.atms[i].id] != null ? this.results.statuses[this.results.atms[i].id].money_order_status_description : '<span class="label label-default">No Status Check</span>';
		
		
		status += this.results.statuses[this.results.atms[i].id] != null ? '<span class="label label-default">' + this.results.statuses[this.results.atms[i].id].bluebird_status_description : '<span class="label label-default">No Status Check</span>';*/
		var tdStatus = $('<td>' + status  + '</td>');
		
		//var statusDate = this.results.statuses[this.results.atms[i].id] != null ? this.results.statuses[this.results.atms[i].id].status_check_date : '' 
		var statusDate = '';
		if(this.results.statuses[this.results.atms[i].id] != null){
			var d =  new Date(this.results.statuses[this.results.atms[i].id].status_check_date);			
			statusDate += (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
			s = d.toLocaleTimeString();			
			statusDate += '   ' + s.substring(0,s.indexOf(":",3)) + s.substring(s.indexOf(" ",3),s.length) + '<br/>';
		}else{
			statusDate += '<span class="">No Status Check</span><br/>';
		}
		var tdStatusDate = $('<td>' + statusDate + '</td>');

		var updateButton = $('<a class="btn btn-link btn-xs">Update</a>')
		updateButton.attr("data-toggle", "modal");
		updateButton.attr("data-target", "#updateModal");		
		updateButton.click((function(i) {
                return function() {
                     obj.setModalContent(i);
                };
            })(i));
		updateButton.appendTo(tdStatusDate);

		var viewHistoryButton = $('<a class="btn btn-link btn-xs">View History</a>')
		viewHistoryButton.attr("data-toggle", "modal");
		viewHistoryButton.attr("data-target", "#updateModal");		
		viewHistoryButton.click((function(i) {
                return function() {
                     obj.setModalContentHistory(i);
                };
            })(i));
		viewHistoryButton.appendTo(tdStatusDate);


		
		//tdName.appendTo(row);
		tdAddress.appendTo(row);
		tdStatus.appendTo(row);
		tdStatusDate.appendTo(row);
		row.appendTo(table);
	}

	

	//set the html
	table.appendTo(this.resultsDiv);
}

AtmSearcher.prototype.setModalContentHistory = function(i){
	console.log("setting modal content");
	console.log(i);
	
	this.modalBody.html("This functionality is coming soon!");

	//get the history object

	//change the display
}


AtmSearcher.prototype.setModalContent = function(i){
	console.log("setting modal content");
	console.log(i);
	
	this.modalBody.html("");


	//populate ATM location description
	var labelTable = $('<table></table>');
	var ltRow = $('<tr></tr>');
	var addressCell = $('<td></td>');
	addressCell.html('<address><strong>' + this.results.atms[i].name + '</strong><br>' + this.results.atms[i].street + '<br>' + this.results.atms[i].city  + ', ' + this.results.atms[i].state + ' ' + this.results.atms[i].postalCode + '<br></address>');
	addressCell.appendTo(ltRow);
	ltRow.appendTo(labelTable);
	labelTable.appendTo(this.modalBody);


	//create form for updating
	this.modalForm = $('<form class="form-horizontal" role="form"></form>');

	this.hiddenInputAtmId = $('<input type="hidden" name="atmId" value="' + this.results.atms[i].id + '" >');
	this.hiddenInputAtmId.appendTo(this.modalForm);

	var currentDate = new Date();

	var dateGroup = $('<div class="form-group"></div>');
	var dateLabel = $('<label for="inputDate" class="col-sm-3 control-label">Date:</label>');
	dateLabel.appendTo(dateGroup);
	var dateDiv = $('<div class="col-sm-5"><input type="date" class="form-control" name="inputDate" id="inputDate" placeholder="' + currentDate.getMonth() + '/' + currentDate.getDate() + '/' + currentDate.getFullYear() + '"></div>');
	dateDiv.appendTo(dateGroup);
	dateGroup.appendTo(this.modalForm);

	var timeGroup = $('<div class="form-group"></div>');
	var timeLabel = $('<label for="inputTime" class="col-sm-3 control-label">Time:</label>');
	timeLabel.appendTo(timeGroup);
	var timeDiv = $('<div class="col-sm-3"><input type="time" class="form-control" name="inputTime"  id="inputTime"></div>');
	timeDiv.appendTo(timeGroup);
	timeGroup.appendTo(this.modalForm);
	

	var bluebirdGroup = $('<div class="form-group"></div>');
	var bluebirdLabel1 = $('<label class="col-sm-3 control-label">Bluebird:</label>');
	bluebirdLabel1.appendTo(bluebirdGroup);
	var bluebirdDiv1 = $('<div class="col-sm-4"><select class="form-control" name="bluebirdStatus"><option value="0">--</option><option value="1">Ok</option><option value="2">Not Working</option></select></div>');
	bluebirdDiv1.appendTo(bluebirdGroup);
	var bluebirdLabel2 = $('<label class="col-sm-2 control-label">Amount:</label>');
	bluebirdLabel2.appendTo(bluebirdGroup);
	var bluebirdDiv2 = $('<div class="col-sm-3"><div class="input-group"><span class="input-group-addon">$</span><input type="text" class="form-control" name="bluebirdAmount" ></div></div>');
	bluebirdDiv2.appendTo(bluebirdGroup);
	bluebirdGroup.appendTo(this.modalForm);

	var moneyOrderGroup = $('<div class="form-group"></div>');
	var moneyOrderLabel1 = $('<label class="col-sm-3 control-label">Money Order:</label>');
	moneyOrderLabel1.appendTo(moneyOrderGroup);
	var moneyOrderDiv1 = $('<div class="col-sm-4"><select class="form-control" name="moneyOrderStatus"><option value="0">--</option><option value="1">Ok</option><option value="2">Not Working</option></select></div>');
	moneyOrderDiv1.appendTo(moneyOrderGroup);
	var moneyOrderLabel2 = $('<label class="col-sm-2 control-label">Amount:</label>');
	moneyOrderLabel2.appendTo(moneyOrderGroup);
	var moneyOrderDiv2 = $('<div class="col-sm-3"><div class="input-group"><span class="input-group-addon">$</span><input type="text" class="form-control" name="moneyOrderAmount" ></div></div>');
	moneyOrderDiv2.appendTo(moneyOrderGroup);
	moneyOrderGroup.appendTo(this.modalForm);

	this.modalForm.appendTo(this.modalBody);
	
}