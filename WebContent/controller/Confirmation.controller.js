sap.ui.define([
	"fioriscan/util/BaseController"
], function (BaseController) {
	"use strict";

	var sActivityType;
	var sDelivery;
	return BaseController.extend("fioriscan.controller.Confirmation", {
		
		onInit: function(){
		   this.getRouter().getRoute("confirmation").attachPatternMatched(this._fnObjectMatched, this);
		}, 
		
		_fnObjectMatched: function(oEvent){
			
			sActivityType = oEvent.getParameter("arguments").activity;
			console.log(sActivityType);
			sDelivery = oEvent.getParameter("arguments").deliverynumber;
			console.log(sDelivery);
			
			this.getView().byId("PackConf1").setText("Delivery " + sDelivery + " has been packed.");
		
		}, 
		
		onPress: function (oEvent){
			this.getRouter().navTo("scannermenu");
		}

	});

});

