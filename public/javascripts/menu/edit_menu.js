Ext.ns("FlairyNotepad.Menu");
// ===================================================================
Flairy.require([
])(function(){
// ===================================================================
FlairyNotepad.Menu.EditMenu = Ext.extend(Ext.menu.Menu,{

	// デフォルトの設定の書き込み
	constructor: function(config) {
		
		// 設定
		FlairyNotepad.Menu.EditMenu.superclass.constructor.call(this, {
			shadow: true,
			items: [
				new Ext.menu.Item({
					text: "取り消す(<u>U</u>)",
					disabled: true
				}),
				new Ext.menu.Item({
					text: "やり直す(<u>R</u>)",
					disabled: true
				}),
				"-",
				new Ext.menu.Item({
					text: "切り取り(<u>X</u>)"
				}),
				new Ext.menu.Item({
					text: "コピー(<u>C</u>)"
				}),
				new Ext.menu.Item({
					text: "ペースト(<u>P</u>)"
				}),
				"-",
				new Ext.menu.Item({
					text: "削除(<u>D</u>)"
				}),
				new Ext.menu.Item({
					text: "全てを選択(<u>A</u>)"
				}),
				"-",
				new Ext.menu.Item({
					text: "検索(<u>P</u>)..."
				})
			]
		}
		);

	}
});


// ===================================================================
})();

