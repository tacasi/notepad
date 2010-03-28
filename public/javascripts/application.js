Ext.ns("FlairyNotepad");
// ===================================================================
Flairy.require([
])(function(){
// ===================================================================
FlairyNotepad.Application = Ext.extend(Flame.Application,{
	
  constructor: function(cfg) {
		cfg = cfg || {};
		Ext.apply(cfg, {meta: {title: "メモ帳"}});
		FlairyNotepad.Application.superclass.constructor.call(this, cfg);
	},

	onMessage: function(msg) {
		if (msg.msg.indexOf("FM_DROP") !== -1) {
			this.openResource(msg.data);
		}

		// 実際にはここに書かずに継承さす。
		if (msg.msg.indexOf("FM_DOOM") !== -1) {
			if(Ext.getCmp("textarea").isDirty()){
			// TODO: 編集中なら警告を出す。
			var dlg = Ext.MessageBox.confirm(
				"終了確認",
				"このリソースは保存されていません. 終了してよろしいですか.",
				function(btn){
					if(btn === 'yes'){
						this.unlockDoc(function(){
							(new Flairy.Msg.Kill(Flairy.Kernel.pid)).post(this.onShutdown);
						});
					} else {
						// シーケンスを中断
						(new Flairy.Msg.Survive("ユーザーによる判断")).post();
					}
				},
				this
			);
			} else {
				//ロック解放
				this.unlockDoc(function(){
					(new Flairy.Msg.Kill(Flairy.Kernel.pid)).post(this.onShutdown);
				});
			}
		}
	},
	unlockDoc: function(fn) {
		if(!FlairyNotepad.currentDocLockURI) {
			fn();
			return;
		}
		Flairy.Ajax.unlock(FlairyNotepad.currentDocLockURI, {
			success: fn,
			failure: fn
		},
		FlairyNotepad.currentDocLockToken
		);
	},
	// frs://のURIをうけとって開く一連の処理を行う
	openResource: function(uri) {
		var data = Ext.getCmp("textarea").getValue();
		var euri = uri.replace("frs:///", "");
		if(!FlairyNotepad.currentDocURI && data === "") {		// 未保存かつ中身が空の場合だけ、内部に読み込む

			read_res(euri, function(data){
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
			});
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

// ===================================================================
})();

