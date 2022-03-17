sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library", 
	"sap/ui/core/routing/History"
], function (Controller, UIComponent, mobileLibrary, History) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("fioriscan.util.BaseController", {
		
		onInit	: function(){
			var sUrl = jQuery.sap.getModulePath("fioriscan") + "/model/localmodel.json";
			var oJsonModel = new sap.ui.model.json.JSONModel();
			oJsonModel.loadData(sUrl, {}, false, "GET", false, true);
			
			//my declaration for local model
      		var oJsonModel = new sap.ui.model.json.JSONModel(); 
			this.getView().setModel(oJsonModel, "local");
			/*this.oListModel = this.getView().getModel("local"); */
		},
		
		getRouter	: function()	{
			return sap.ui.core.UIComponent.getRouterFor(this);
		}, 
		
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("scandelivery", {}, true /*no history*/);
			}
		},
		
		
		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		}, 
		
		fn_oListModel: function(){
			return this.oListModel = this.getView().getModel("local");
		}
	
		
	});

});