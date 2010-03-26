Ext.ns("FlairyNotepad.Toolbar");
// ===================================================================
Flairy.require([
  {"FlairyNotepad.Menu.ResMenu": "javascripts/menu/res_menu.js"},
  {"FlairyNotepad.Menu.EditMenu": "javascripts/menu/edit_menu.js"}
])(function(){
// ===================================================================
FlairyNotepad.Toolbar.MenuBar = Ext.extend(Ext.Toolbar,{
	// デフォルトの設定の書き込み
	constructor: function(config) {
		this.config = config;
		
		// 設定
		FlairyNotepad.Toolbar.MenuBar.superclass.constructor.call(this, {
			items:[
				{ text: "<b>リソース</b>", 	menu: new FlairyNotepad.Menu.ResMenu({})}
	]
		});
		
		
	}
});

// ===================================================================
})();
