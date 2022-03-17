sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {	
	"use strict";

	return UIComponent.extend("fioriscan.Component", {

			metadata : {
				manifest: "json"
			},

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * In this function, the FLP and device models are set and the router is initialized.
			 * @public
			 * @override
			 */
			init : function () {
				//Model initialization
				var oScreenInput = new JSONModel(); 
				var oPickedItems = new JSONModel();
				var oGS1Barcode  = new JSONModel();
				//var oDeliveryItems = new JSONModel();
				
				oScreenInput.setData(oScreenInput);
				oPickedItems.setData(oPickedItems);
				oGS1Barcode.setData(oGS1Barcode);
				//oDeliveryItems.setData(oDeliveryItems);
				
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);
				
				this.setModel(models.fnCreateScreenInput(), "screenInput");
				this.setModel(models.fnCreatePickedItems(), "pickedItems");
				this.setModel(models.fnStoreGS1(), "gs1Barcode");
				//this.setModel(models.fnDisplayDeliveryItemsList(), "deliveryItems");
				
				// create the views based on the url/hash
				this.getRouter().initialize();
				
			}
		});

	}
);