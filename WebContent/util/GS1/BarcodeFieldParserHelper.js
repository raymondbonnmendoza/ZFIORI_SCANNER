sap.ui.define([
 "sap/ui/core/mvc/Controller",		
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "fioriscan/util/GS1/BarcodeStringHelper"
], function(Controller, Object, JSONModel, BarcodeStringHelper) {
  "use strict";
  return Object.extend("fioriscan.util.GS1.BarcodeFieldParserHelper", {
    constructor: function(aidefined, ailength, payload_length, var_length) {
      if (ailength) {
        this.ailength = ailength;
      }
      if (aidefined) {
        this.aidefined = aidefined;
      }
      if (payload_length) {
        this.payload_length = payload_length;
      }
      if (var_length) {
        this.var_length = var_length;
      }
      this.model = new JSONModel();
      this.model.setData(this);
    },
    parse: function(scan) {
     // this.ai = scan.ai_peek(this.ailength);
	  this.ai = scan.aiPeek(this.ailength);
      if (this.ai != this.aidefined){
          return "ERR";
        }
      this.ai = scan.read(this.ailength);
      if (this.ai === "ERR") {
        return this.ai;
      }
   //   if (this.var_length){
      //  var lv_payload_length = scan.get_var_length( this.payload_length );
      //}
      //if (this.payload_length){
       // this.payload = scan.read( lv_payload_length );
      //}
      //else {
        this.payload = scan.read( this.payload_length );
      //}
      if (this.payload === "ERR") {
        return this.payload;
      }
/*      if (!(this.var_length) && (this.payload.length < this.payload_length)) {
          return "ERR";
      }*/
    }
  });
});