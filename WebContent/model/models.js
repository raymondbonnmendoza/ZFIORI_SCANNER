sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {
			
			fnCreateScreenInput: function (){
				var oScreenInput	= new JSONModel();
				oScreenInput.setData({
					"barcodeNumber" : "",
					"deliveryNo" : ""
				});
				return oScreenInput;
			}, 
			
			fnCreatePickedItems: function (){
				var oPickedItems	= new JSONModel();
				oPickedItems.setData({
					"materialNo" : "",
					"selected" : ""
				});
				return oPickedItems;
			}, 
			
			fnStoreGS1: function (){
				var oGS1Barcode = new JSONModel();
				oGS1Barcode.setData({
					"ai" : "",
					"payload" : ""
				});
				return oGS1Barcode;
			}
			
/*			fnDisplayDeliveryItemsList: function (){
				var oDeliveryItemsList	= new JSONModel();
				oDeliveryItemsList.setData({
					"Delivery_number" : "",
					"Item_number" : "", 
					"Material_number" : "", 
					"Quantity" : "", 
					"Batch" : "", 
					"Material_description" : "", 
					"Pick" : ""
				});
				return oDeliveryItemsList;
			}
			*/
			
	};
});


