sap.ui.define([
	"fioriscan/util/BaseController",
	"sap/ui/model/json/JSONModel", 
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", 
	"sap/m/MessageToast", 
	"fioriscan/util/ItemListHelper",
	"fioriscan/util/GS1/BarcodeParserHelper"
], function (BaseController, JSONModel, Filter, FilterOperator, MessageToast, ItemListHelper, BarcodeParserHelper) {
	"use strict";

	var sActivityType;
	var sDelivery;
	return BaseController.extend("fioriscan.controller.PickDeliveryItems", {
		BarcodeParserHelper: BarcodeParserHelper,
		ItemListHelper: ItemListHelper,
		
		onInit: function(){
/*			var oJsonModel = new sap.ui.model.json.JSONModel(); 
			this.getView().setModel(oJsonModel, "local"); 
			this.oListModel = this.getView().getModel("local"); */
			
			this.getRouter().getRoute("pickdelitems").attachPatternMatched(this._fnObjectMatched, this);
			this.odataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCAN_FIORI_ODATA_SRV_01_SRV");
			
		},
		
		_fnObjectMatched: function(oEvent){
			
			sActivityType = oEvent.getParameter("arguments").activity;
			MessageToast.show(sActivityType);
			sDelivery = oEvent.getParameter("arguments").deliverynumber;
			MessageToast.show(sDelivery);
			
			var oScreenInput = this.getOwnerComponent().getModel("screenInput");
		    oScreenInput.setProperty("/deliveryNo", sDelivery);

			var lvDeliveryNo = oScreenInput.getProperty("/deliveryNo");
			var aFilter = []; 
			//aFilter.push(new Filter("Delivery_number", FilterOperator.EQ, lvDeliveryNo));sDelivery 
			aFilter.push(new Filter("Delivery_number", FilterOperator.EQ, sDelivery));
			this.getView().getModel().read("/ZDELIVERY_DETAILSSet", {
				filters: aFilter, 
				success: jQuery.proxy(function(oData){
					for (var i = 0; i < oData.results.length; i++) {
					  oData.results[i].NewlyScanned = false;
					  oData.results[i].Scanned = false;
					  console.log(oData.results[i]);
					}
					//this.oListModel.setProperty("/DeliveryItemsListDisplay", oData.results); 
					this.fn_oListModel().setProperty("/DeliveryItemsListDisplay", oData.results);
					//this.oListModel.refresh(true);
					this.fn_oListModel().refresh(true);
				}, this),
				error: jQuery.proxy(function(oResponse){
					
				}, this)
			});

		},
		
		
		onAfterRendering: function(){
			console.log("Test");
			//this.getRouter().getRoute("pickdelitems").attachPatternMatched(this._fnObjectMatched, this);

			// init model
			//var aFilter = []; 

			var oScreenInput = this.getOwnerComponent().getModel("screenInput");
			//oScreenInput.setProperty("/deliveryNo", sDelivery);
			var opickedItems = this.getOwnerComponent().getModel("pickedItems");
			//var lvDeliveryNo = sDelivery;
			var lvDeliveryNo = oScreenInput.getProperty("/deliveryNo");

			
			// build filter array
			//aFilter.push(new Filter("Delivery_number", FilterOperator.EQ, lvDeliveryNo));

			// filter binding	OLD odata call code
/*			var oList = this.getView().byId("DeliveryItemsList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			MessageToast.show(oList);*/
			
			//new odata call trial
/*			var aFilter = []; 
			aFilter.push(new Filter("Delivery_number", FilterOperator.EQ, lvDeliveryNo));
			
			this.getView().getModel().read("/ZDELIVERY_DETAILSSet", {
				filters: aFilter, 
				success: jQuery.proxy(function(oData){
					for (var i = 0; i < oData.results.length; i++) {
					  oData.results[i].NewlyScanned = false;
					  oData.results[i].Scanned = false;
					  console.log(oData.results[i]);
					}
					//this.oListModel.setProperty("/DeliveryItemsListDisplay", oData.results); 
					this.fn_oListModel().setProperty("/DeliveryItemsListDisplay", oData.results);
					//this.oListModel.refresh(true);
					this.fn_oListModel().refresh(true);
				}, this),
				error: jQuery.proxy(function(oResponse){
					
				}, this)
			});*/
		
		},
		
		onExit : function() {

		if (this.oRouteHandler) {
			this.oRouteHandler.destroy();
		}
			sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
		}, 
		
		onMaterialScan: function(oEvent){
			
			//pass to Mike
			var oEntry = {};
			var oScreenInput = this.getOwnerComponent().getModel("screenInput");
			var pickSuccess = "";
			
			//Tempoarary code for temporary parsing; real code commented out
			var lvMaterial = this.getView().byId("MaterialInput").getValue(); 
			//var lvMaterial = this.getView().byId("MaterialInput").getValue().split("_")[0]; 
			//real parsing code 
			BarcodeParserHelper.constructor.call(this, lvMaterial);	
		    var lvMatParsed = BarcodeParserHelper.get_material.call(this);	
			var lvBatchParsed = BarcodeParserHelper.get_batch.call(this);
			
			var lvDeliveryNo = oScreenInput.getProperty("/deliveryNo");
			lvMaterial = lvMatParsed;
			
			//get delivery no. and item no. to pass
			//var lvMaterial = this.getView().byId("MaterialInput").getValue();
			//Tempoarary code for temporary parsing; real code commented out below
			for (var i = 0; i < this.oListModel.getProperty("/DeliveryItemsListDisplay").length; i++ ){
				if ( lvMaterial === this.oListModel.getProperty("/DeliveryItemsListDisplay")[i].Material_number 
					&& lvBatchParsed === this.oListModel.getProperty("/DeliveryItemsListDisplay")[i].Batch ){
				     var lvItemNo = this.oListModel.getProperty("/DeliveryItemsListDisplay")[i].Item_number;
				}
			}
			//var lvItemNo = this.getView().byId("MaterialInput").getValue().split("_")[1];  
									
			oEntry.Delivery_number = lvDeliveryNo;
			oEntry.Item_number = lvItemNo;
			//oEntry.Material_number = lvMaterial;
			
			//pass to Mike
			this.odataModel.update("/ZDELIVERY_DETAILSSet(Delivery_number='"+lvDeliveryNo+"',Item_number='"+lvItemNo+"',HU='"+'0'+"')", oEntry, null, function(){
				var sMsg="Update successful.";
					console.log(sMsg);
					//mark newly scanned for the update of the view
					pickSuccess = 'X';
				
			    }, function(){
					pickSuccess = null;
					console.log("Error in updating.");
			});
				
			
			//start of my local model
			//var lvMaterial = this.getView().byId("MaterialInput").getValue();
			if (pickSuccess != null){	//my picking is successful
				for (var i = 0; i < this.fn_oListModel().getProperty("/DeliveryItemsListDisplay").length; i++ ){
					if ( lvMaterial === this.fn_oListModel().getProperty("/DeliveryItemsListDisplay")[i].Material_number 
							&& lvItemNo === this.fn_oListModel().getProperty("/DeliveryItemsListDisplay")[i].Item_number ){
					     this.fn_oListModel().getProperty("/DeliveryItemsListDisplay")[i].NewlyScanned = true;
					}
				}
			}
				
			//i wanna see the values again
			for (var j = 0; j < this.fn_oListModel().getProperty("/DeliveryItemsListDisplay").length; j++) {
					  console.log(this.fn_oListModel().getProperty("/DeliveryItemsListDisplay")[j]);
			}
			
			var oList = this.getView().byId("DeliveryItemsList");
			this.fn_oListModel().refresh(true);
			oList.getBinding("items").refresh(true);
		}, 
		
		onPress: function(oEvent){
			var lvdontNav = null;
			var oList = this.getView().byId("DeliveryItemsList");
				
			 //because sPath is "/DeliveryItemsListDisplay/n", i need to get n.
		    var n= oEvent.getSource().getBindingContext("local").getPath().split("/")[2]; 
			this.fn_oListModel().getProperty("/DeliveryItemsListDisplay")[n].Scanned = true;
			
			//i want to refresh my model and my view
			this.fn_oListModel().refresh(true);
			oList.getBinding("items").refresh(true);
			
			//i wanna see the values again
			for (var j = 0; j < this.fn_oListModel().getProperty("/DeliveryItemsListDisplay").length; j++) {
					  console.log(this.fn_oListModel().getProperty("/DeliveryItemsListDisplay")[j]);
			}
			
			//i want to see if all items have been scanned already and if I can already navigate to
			//the next page.
			for (var k = 0; k < this.fn_oListModel().getProperty("/DeliveryItemsListDisplay").length; k++) {
				if (this.fn_oListModel().getProperty("/DeliveryItemsListDisplay")[k].Scanned === false){
					lvdontNav = 'X';
				}
			}
			
			//lvdontNav = ' '; //this is a temporary code only; until parsing is applied
			
			if (lvdontNav === null){
				this.getRouter().navTo("packdelitems", {activity: sActivityType, deliverynumber: sDelivery});
			}
			
			this.getView().byId("MaterialInput").setValue("");
	
		}

	});

});

