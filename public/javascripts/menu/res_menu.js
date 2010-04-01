Ext.ns("FlairyNotepad.Menu");

function showOpenDialog(xuri) {
	var w = new Flame.Dialog.Open({
							singleSelect: true,
							multiSelect: false,
							defaultUri: xuri,
							submit: function(dlg, euri) {
								var data = Ext.getCmp("textarea").getValue();
								if(!FlairyNotepad.currentDocURI && data === "") {		// 未保存かつ中身が空の場合だけ、内部に読み込む

									read_res(euri, 
										function(data){
											Ext.getCmp("textarea").originalValue = data;
											Ext.getCmp("textarea").setValue(data);
											FlairyNotepad.currentDocURI = euri;

								// タイトルの設定
								var furi = new Flairy.Uri("frs:///" + FlairyNotepad.currentDocURI);
								var furis = furi.path.split("/");
								var shortname = furis[furis.length-1];
								app.setTitle(decodeURIComponent(shortname));

										},
										function(resp){
											var msg = Flairy.Res.Message[resp.status];
											if(!msg) {
												msg = "原因は不明です."
											}
											Ext.Msg.alert("失敗", Flairy.Res.Message[resp.status]);
										}
									);

								} else {
									var opt = {
										args: "frs:///" + euri
									};
				
									// アプリとして起動
									(new Flairy.Msg.Exec("https://notepad.flairy.jp/" + "?" + Ext.urlEncode(opt))).post();								
								}
								return true;	// 正常終了
							}
						});
						w.show();
	
}

// ===================================================================
Flairy.require([
])(function(){
// ===================================================================
FlairyNotepad.Menu.ResMenu = Ext.extend(Ext.menu.Menu,{
	constructor: function(config) {
		FlairyNotepad.Menu.ResMenu.superclass.constructor.call(this, {
			shadow: true,
			items: [
				new Ext.menu.Item({
					text: "新規",
					handler: function() {
						// カーネルのexec機能をを呼び出す。
						new Flairy.Msg.Exec("https://notepad.flairy.jp").post();
					}
				}),
				new Ext.menu.Item({
					text: "開く...",
					handler: function(){
						showOpenDialog();
					}
				}),
				"-",
				new Ext.menu.Item({
					text: "上書き保存",
					handler: function(){
						var euri = FlairyNotepad.currentDocURI;
						if(!euri) {
							// 名前を付けて保存をすべき
						var w = new Flame.Dialog.Save({
							ctype: FlairyNotepad.currentDocCType,
							path: FlairyNotepad.currentDocCType,
							singleSelect: true,
							multiSelect: false,
							submit: function(dlg, euri) {
								var data = Ext.getCmp("textarea").getValue();
								write_res(euri, data, function(){
									FlairyNotepad.currentDocURI = euri;
									Ext.getCmp("textarea").originalValue = Ext.getCmp("textarea").getValue();

									// タイトルの設定
									var furi = new Flairy.Uri("frs:///" + FlairyNotepad.currentDocURI);
									var furis = furi.path.split("/");
									var shortname = furis[furis.length-1];
									app.setTitle(FlairyNotepad.currentDocURI);
								}, FlairyNotepad.currentDocCType);
								return true;	// 正常終了
							}
						});
						w.show(this.getEl());
						} else {
							var data = Ext.getCmp("textarea").getValue();
							write_res(euri, data, function(){
									Ext.getCmp("textarea").originalValue = Ext.getCmp("textarea").getValue();

								// タイトルの設定
								var furi = new Flairy.Uri("frs:///" + FlairyNotepad.currentDocURI);
								var furis = furi.path.split("/");
								var shortname = furis[furis.length-1];
								app.setTitle(FlairyNotepad.currentDocURI);
							}, FlairyNotepad.currentDocCType);
						}
					}
				}),
				new Ext.menu.Item({
					text: "名前を付けて保存...",
					handler: function(){
						if(FlairyNotepad.currentDocURI){
							var cduri = FlairyNotepad.currentDocURI.match(/^\//) ? FlairyNotepad.currentDocURI : "/" + FlairyNotepad.currentDocURI;
						} else {
							cduri = "/";
						}
						var w = new Flame.Dialog.Save({
							singleSelect: true,
							multiSelect: false,
							ctype: FlairyNotepad.currentDocCType, 
							path: cduri,
							submit: function(dlg, euri, mime) {
								var data = Ext.getCmp("textarea").getValue();
								write_res(euri, data, function(){
									FlairyNotepad.currentDocURI = euri;
									Ext.getCmp("textarea").originalValue = Ext.getCmp("textarea").getValue();

									// タイトルの設定
									var furi = new Flairy.Uri("frs:///" + FlairyNotepad.currentDocURI);
									var furis = furi.path.split("/");
									var shortname = furis[furis.length-1];
									app.setTitle(FlairyNotepad.currentDocURI);
								}, mime);
								return true;	// 正常終了
							}
						});
						w.show(this.getEl());
					}
				}),
				"-",
				new Ext.menu.Item({
					text: "メモ帳を終了",
					handler: function() {
						new Flairy.Msg.Term(Flairy.Kernel.pid).post();
					}
				})
			]
		});
	}
});

// ===================================================================
})();

