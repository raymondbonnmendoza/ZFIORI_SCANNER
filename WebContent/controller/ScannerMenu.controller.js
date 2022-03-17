sap.ui.define([
	"fioriscan/util/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("fioriscan.controller.ScannerMenu", {
		
		onPack: function(oEvent){
			this.getRouter().navTo("scandelivery", {activity: 1})
		}


	});

});

