sap.ui.define([
 "sap/ui/core/mvc/Controller",
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "fioriscan/util/GS1/BarcodeStringHelper",
  "fioriscan/util/GS1/BarcodeFieldParserHelper",
], function(Controller, Object, JSONModel, BarcodeStringHelper, BarcodeFieldParserHelper) {
  "use strict";
/*  return Object.extend("fioriscan.util.GS1.BarcodeParserHelper", {*/
	
	var AddBarcodeParseHelper = {
		
		BarcodeStringHelper	: BarcodeStringHelper,
		BarcodeFieldParserHelper: BarcodeFieldParserHelper,
		
		
	    constructor: function(scan) {
		  var oGS1Barcode = this.getOwnerComponent().getModel("gs1Barcode");

		  this.tab_fields = [];
	      if (scan) {
	    	var parsers = [];
			parsers.push(new BarcodeFieldParserHelper("91", "2", "10", ""));
			parsers.push(new BarcodeFieldParserHelper("240", "3", "8", ""));
			parsers.push(new BarcodeFieldParserHelper("10", "2", "10", ""));
			parsers.push(new BarcodeFieldParserHelper("00", "2", "18", ""));
			parsers.push(new BarcodeFieldParserHelper("30", "2", "4", ""));
			
			var barcode = new BarcodeStringHelper(scan);  
	
			while (barcode.hasMore()) {
			  var parsed = "false";
	          for (var i = 0; i < parsers.length; i++){
			    var msg = parsers[i].parse( barcode );
				if (msg == "ERR"){
				} else {
		          parsed = "true";
				  this.tab_fields.push({
					"ai": parsers[i].ai,
					"payload": parsers[i].payload,
				  });
				  //oGS1Barcode.setProperty("", this.tab_fields)
/*				  oGS1Barcode.setProperty("/ai", parsers[i].ai);
				  oGS1Barcode.setProperty("/payload", parsers[i].payload);*/
				}
			  }
			  if (!(parsed)){
				return "ERR";
			  }
			}
	      }
		  //this.model = new JSONModel();
	      //this.model.setData(this);
		  oGS1Barcode.setData(this.tab_fields);
	    },
	    get_batch: function() {
/*	      return this.tab_fields.filter(function(o) {
			return o.ai == "10";
		  })[0].payload;*/
		   var oGS1Barcode = this.getOwnerComponent().getModel("gs1Barcode");
		   for (var i = 0; i < oGS1Barcode.getData(this.tab_fields).length; i++){
				if (oGS1Barcode.getData(this.tab_fields)[i].ai === "10"){
					return oGS1Barcode.getData(this.tab_fields)[i].payload;
				}
			}
	    },
	    get_delivery: function() {
/*	      return this.tab_fields.filter(function(o) {
			return o.ai == "91";
		  })[0].payload;*/
		   var oGS1Barcode = this.getOwnerComponent().getModel("gs1Barcode");
		   for (var i = 0; i < oGS1Barcode.getData(this.tab_fields).length; i++){
				if (oGS1Barcode.getData(this.tab_fields)[i].ai === "91"){
					return oGS1Barcode.getData(this.tab_fields)[i].payload;
				}
			}
	    },
	    get_material: function() {
/*	      return this.tab_fields.filter(function(o) {
			return o.ai == "240";
		  })[0].payload;*/
		   var oGS1Barcode = this.getOwnerComponent().getModel("gs1Barcode");
		   for (var i = 0; i < oGS1Barcode.getData(this.tab_fields).length; i++){
				if (oGS1Barcode.getData(this.tab_fields)[i].ai === "240"){
					return oGS1Barcode.getData(this.tab_fields)[i].payload;
				}
			}
	    },
	    get_quantity: function() {
	      return this.tab_fields.filter(function(o) {
			return o.ai == "30";
		  })[0].payload;
	    },
	    get_sscc: function() {
	      return this.tab_fields.filter(function(o) {
			return o.ai == "00";
		  })[0].payload;
	    },

	};	return AddBarcodeParseHelper;
/*  });*/
});