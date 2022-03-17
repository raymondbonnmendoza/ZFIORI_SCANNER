sap.ui.define([
  "sap/ui/core/mvc/Controller",	
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel"
], function(Controller, Object, JSONModel) {
  "use strict";
  return Object.extend("fioriscan.util.GS1.BarcodeStringHelper", {
    constructor: function(scan) {
      var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
      var numbers = "0123456789";
	  this.allowed = [];
      this.aiallowed = [];
//    special = "!"%''&*,-./:;<=>?_+ÆØÅ";
	  for (var i = 0; i < letters.length; i++){
		this.allowed.push(letters.substr(i, 1));		
      }
	  for (var j = 0; j < numbers.length; j++){
		this.allowed.push(numbers.substr(j, 1));
        this.aiallowed.push(numbers.substr(j, 1));		
      }
	  if (scan) {
        this.scan = scan;
        this.index = 0;
		//this.scan.replace(/[()]/g, '');
		this.scan = this.scan.replace(/[|(|)|]|\*/g, "");
        this.scan = this.scan.replace("{GS}", "#");
      }
	  this.model = new JSONModel();
      this.model.setData(this);
    },
    read: function(length) {
	  var read = "";
      if (this.index === this.scan.length) {
        return "END";
	  }
	  else {
		for (var k = 0; k < length; k++){
		  if (this.index === this.scan.length) {
			return "END";
	      }
          if (this.allowed.includes(this.scan.substr(this.index, 1))) {
			read = read + this.scan.substr(this.index, 1);
			this.index++;
          }	
          else {
			return "ERR";
          }				
	    }
		return read;
	  }
    },
	aiPeek: function(length) {
     var read2 = "";
	 if (this.index === this.scan.length) {
		// if (this.index = this.scan.length) {
        return "END";
	  }
	  else {
		var offset = this.index;
		for (var i = 0; i < length; i++){
		  if (offset === this.scan.length) {	
		  //if (offset = this.scan.length) {
			return "END";
	      }
          if (this.aiallowed.includes(this.scan.substr(offset, 1))) {
			read2 = read2 + this.scan.substr(offset, 1);
			offset++;
          }	
          else {
			return "ERR";
          }				
	    }
		return read2;
      }
    },
	hasMore: function() {
      return this.scan.length > this.index;
    },
    getModel: function() {
      return this.model;
    }
  });
});