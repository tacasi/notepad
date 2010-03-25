Ext.ns("FlairyNotepad.Field");
// ===================================================================
Flairy.require([
])(function(){
// ===================================================================
FlairyNotepad.Field.TextArea = Ext.extend(Ext.form.TextArea,{


	// デフォルトの設定の書き込み
	constructor: function(config) {
		this.config = config;
		
		// 設定
		FlairyNotepad.Field.TextArea.superclass.constructor.call(this, {
			fieldClass: "",
			id: "textarea",
			width: "100%",
			autoCreate: {tag: "textarea", style: "width:100px;height:60px;", autocomplete: "off", wrap: "soft"}
		});
		
		this.on("change", function(){editflag = true;});
		this.on("keypress", function(){editflag = true;});
		this.on("specialKey", function(field, e){
			if(e.getKey() === e.TAB){
				e.preventDefault();
			}
		});
		
	}

});

// ===================================================================
})();
