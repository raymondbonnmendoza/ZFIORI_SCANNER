sap.ui.define([
	"fioriscan/util/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast", 
	"fioriscan/util/GS1/BarcodeParserHelper"
], function (BaseController, JSONModel, MessageToast, BarcodeParserHelper) {
	"use strict";

	var sActivityType;
	return BaseController.extend("fioriscan.controller.ScanDelivery", {
		
		BarcodeParserHelper: BarcodeParserHelper,
			
		onInit: function(){
			
			this.getRouter().getRoute("scandelivery").attachPatternMatched(this._fnObjectMatched, this);
			//test material parsing
/*			debugger;
		    BarcodeParserHelper.constructor.call(this, "*(240)EWMS4-20(10)TESTBATCH1");	
		    var lvMatParsed = BarcodeParserHelper.get_material.call(this);	
			var lvBatchParsed = BarcodeParserHelper.get_material.call(this);*/	
		},
		
		_fnObjectMatched: function(oEvent){
			
			sActivityType = oEvent.getParameter("arguments").activity;
			MessageToast.show(sActivityType);
		},

		onTypeDelivery: function(oEvent){
		  // init model
		  var oScreenInput = this.getView().getModel("screenInput");	
		  var lvBarcode = oScreenInput.getProperty("/barcodeNumber");

		  //parsing
		  BarcodeParserHelper.constructor.call(this, lvBarcode);	
		  var lvDelivery = BarcodeParserHelper.get_delivery.call(this);	
		  oScreenInput.setProperty("/deliveryNo", lvDelivery);
			
		}, 
		
		onDeliveryScan: function(oEvent){
			// init model
			var oScreenInput = this.getView().getModel("screenInput");	
			
			//get the value of delivery barcode and then scan
			var oScreenInput = this.getView().getModel("screenInput");
			var lvDelivery = oScreenInput.getProperty("/deliveryNo");
			
			if(lvDelivery != null){
			  var lvBarcode = oScreenInput.getProperty("/barcodeNumber");

			  //parsing
			  BarcodeParserHelper.constructor.call(this, lvBarcode);	
			  var lvDelivery = BarcodeParserHelper.get_delivery.call(this);	
			  oScreenInput.setProperty("/deliveryNo", lvDelivery);
			}
			
			this.getRouter().navTo("pickdelitems", {activity: sActivityType, deliverynumber: lvDelivery}); //this is my code for navigation

		}

	});

});

