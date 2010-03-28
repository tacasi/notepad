Ext.ns("FlairyNotepad.Panel");
// ===================================================================
Flairy.require([
  {
  	"FlairyNotepad.Field.TextArea": "javascripts/field/text_area.js",
  	"FlairyNotepad.Toolbar.MenuBar": "javascripts/toolbar/menu_bar.js"
  }
])(function(){
// ===================================================================
FlairyNotepad.Panel.MainPanel = Ext.extend(Ext.Panel,{
	// デフォルトの設定の書き込み
	constructor: function(config) {
		this.context = config.context;
		var ta = new FlairyNotepad.Field.TextArea(this.context);
		FlairyNotepad.Panel.MainPanel.superclass.constructor.call(this, {
			id: "app_window",
			layout: "fit",
			tbar: new FlairyNotepad.Toolbar.MenuBar(this.context),
			items: [ta]
		});

		// 開始直後オープンファイルの指定
		if(app.getParams().args){
			this.handleArgs(app.getParams().args);
		}
	},
	handleArgs: function(args) {
		Ext.each(args.split(/[ \t]/), function(item, index, allItems){
			this.handleArg(item, index);
		}, this);
	},
	handleArg: function(arg, index) {
		// argをまずfrs:///形式に統一する    (from: hoge.txt形式、/xx/yy.txt形式)
		if(!arg.match(/^frs:/)) {
			if(arg.match(/^\//)){
				arg = "frs://" + arg;
			} else {
				arg = "frs:///" + arg;
			}
		}
		
		var u = new Flairy.Uri(arg).httpsize();
		var euri = u.path.replace("/~~flairy~~/res/", "");
		
		
		// HEADで種類を調べる
	Flairy.Ajax.head("/~~flairy~~/res/" + euri,{
		success: function(resp, opt) {
			var ct = resp.getResponseHeader("Content-Type");
			if (ct === "application/x-collection") {
				this.openCol(euri);
			} else {
				this.openRes(euri);
			}
		},
		failure: function(resp, opt) {
			failback(resp);
		},
		disableCaching: true,
		scope: this
	});		

	},
	openRes: function(euri){
		read_res(euri, 
			function(data) {
				Ext.getCmp("textarea").originalValue = data;
				Ext.getCmp("textarea").setValue(data);
				FlairyNotepad.currentDocURI = euri;
				app.setTitle("メモ帳 - " + FlairyNotepad.currentDocURI);
			},
			function(resp, opt){
				// 対象がディレクトリであった可能性を検討
				var msg = Flairy.Res.Message[resp.status];
				if(!msg) {
					msg = "原因は不明です."
				}
				Ext.Msg.alert("失敗", msg, function(){
					(new Flairy.Msg.Kill(Flairy.Kernel.pid)).post(this.onShutdown);
				});
			}
		);				
	},
	openCol: function(euri){
//		(function(){
			showOpenDialog("/" + euri);
//		}).defer();
	}	
});
// ===================================================================
})();
