Ext.ns("FlairyNotepad.Field");
// ===================================================================
Flairy.require([
])(function(){
// ===================================================================
FlairyNotepad.Field.TextArea = Ext.extend(Ext.form.TextArea,{

	constructor: function(config) {
		FlairyNotepad.Field.TextArea.superclass.constructor.call(this, {
			id: "textarea",
			fieldClass: "",
			width: "100%",
			autoCreate: {tag: "textarea", style: "width:100px;height:60px;", autocomplete: "off", wrap: "soft"}
		});
		
		this.on("change", function(){ editflag = true;});
		this.on("keypress", function(){ editflag = true;});
		this.on("specialKey", function(field, e){
			if(e.getKey() === e.TAB){
				e.preventDefault();
			}
		});
	}
});

// ===================================================================
})();
