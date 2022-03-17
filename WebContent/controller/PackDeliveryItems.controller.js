sap.ui.define([
	"fioriscan/util/BaseController",
	"sap/ui/model/json/JSONModel", 
	"fioriscan/util/ItemListHelper", 
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea", 
	"sap/ui/core/Core", 
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout"
], function (BaseController, JSONModel, ItemListHelper, Filter, FilterOperator, Dialog, DialogType, Button, ButtonType, Label, MessageToast, Text, TextArea, Core, HorizontalLayout, VerticalLayout) {
	"use strict";

	var sActivityType;
	var sDelivery;
	return BaseController.extend("fioriscan.controller.PackDeliveryItems", {
		
		ItemListHelper: ItemListHelper,
	
		onInit: function(){
		   this.getRouter().getRoute("packdelitems").attachPatternMatched(this._fnObjectMatched, this);
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
					this.fn_oListModel().setProperty("/PickedItemsListDisplay", oData.results);
					//this.oListModel.refresh(true);
					this.fn_oListModel().refresh(true);
				}, this),
				error: jQuery.proxy(function(oResponse){
					
				}, this)
			});

		},
				
		
		onPackPress: function () {
			var oEntry = {};
			var aFilter = [];
			var oScreenInput = this.getOwnerComponent().getModel("screenInput");
			var lvDeliveryNo = oScreenInput.getProperty("/deliveryNo");
			//var lvdummyItem = this.fn_oListModel().getProperty("/PickedItemsListDisplay")[0].Item_number;
			var lvdummyItem = '000000';
			
			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new Dialog({
					type: DialogType.Message,
					title: "Scan Handling Unit",
					content: [
						new Label({
							text: "Pack Delivery Items Into Handling Unit",
							labelFor: "packNote"
						}),
						new TextArea("packNote", {
							width: "100%",
							placeholder: "Handling Unit (required)",
							liveChange: function (oEvent) {
								var sText = oEvent.getParameter("value");
								this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
							}.bind(this)
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Scan",
						enabled: false,
						press: function () {
							var sText = Core.byId("packNote").getValue();
							//MessageToast.show("Handling unit is: " + sText);
							
							
							
							oEntry.Delivery_number = lvDeliveryNo;
							oEntry.Item_number = lvdummyItem;
							oEntry.HU = sText;
							
							//get call
							aFilter.push(new Filter("Delivery_number", FilterOperator.EQ, lvDeliveryNo));
							aFilter.push(new Filter("HU", FilterOperator.EQ, sText));
							
							this.getView().getModel().read("/ZDELIVERY_DETAILSSet", {
								filters: aFilter, 
								success: jQuery.proxy(function(oData){
									for (var i = 0; i < oData.results.length; i++) {
									  oData.results[i].NewlyScanned = false;
									  oData.results[i].Scanned = false;
									  console.log(oData.results[i]);
									}
									
									//navigate to Confirmation page
									this.getRouter().navTo("confirmation", {activity: sActivityType, deliverynumber: lvDeliveryNo});
								}, this),
								error: jQuery.proxy(function(oResponse){
									
								}, this)
							});
							
							//update call
							this.odataModel.update("/ZDELIVERY_DETAILSSet(Delivery_number='"+lvDeliveryNo+"',Item_number='"+lvdummyItem+"',HU='"+sText+"')", oEntry, null, function(){
								var sMsg="Packing Successful.";
									console.log(sMsg);
								
							    }, function(){
									var pickSuccess = null;
									console.log("Error in packing.");
							});							
								
							this.oSubmitDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oSubmitDialog.close();
						}.bind(this)
					})
				});
			}

			this.oSubmitDialog.open();
		},


	});

});

