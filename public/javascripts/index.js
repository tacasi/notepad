Ext.ns("FlairyNotepad");
// ===================================================================
Flairy.require([
  {"FlairyNotepad.Application": "javascripts/application.js"},
  {"FlairyNotepad.Panel.MainPanel": "javascripts/panel/main_panel.js"}
])(function(){
// ===================================================================

	// アプリケーションインスタンス化
	window.app = new FlairyNotepad.Application();

	window.mp = new FlairyNotepad.Panel.MainPanel({
		context: null
	});
	// Viewportを作成
    window.viewport = new Ext.Viewport({
    	id: 'viewport',
		renderTo: Ext.getBody(),
		layout: 'fit',
		items: [mp]
	});

/*
		var mainPanelDropTargetEl = mp.getEl().dom;
		var mainPanelDropTarget = new Ext.dd.DropTarget(mainPanelDropTargetEl, {
			ddGroup : "gridDDGroup",
			notifyEnter: function(ddSource, e, data) {
				this.body.stopFx();
				this.body.highlight();
				alert("zz");
			},
			notifyDrop : function(ddSource, e, data) {
				alert("zz");
			}
		});
*/
	// 最終レンダリング
	window.viewport.doLayout(false);
	Ext.getCmp("textarea").focus();

// ===================================================================
})();



// Defulat content-type
FlairyNotepad.currentDocCType = Flairy.Mime.TEXT_PLAIN;

function getSessionCID() {
	return location.hash.substr(1);
}


// TODO: 将来カーネル内へ移動
function read_res(uri, callback, failback) {
	// ここでロックを行う
	Flairy.Ajax.lock("/~~flairy~~/res" + uri, {
		success: function(resp1, opt1) {
			FlairyNotepad.currentDocLockToken = Ext.util.JSON.decode(resp1.responseText).token;
			FlairyNotepad.currentDocLockURI = "/~~flairy~~/res/" + uri;

	// 本来の処理
	Flairy.Ajax.get("/~~flairy~~/res/" + uri,{
		success: function(resp, opt) {
			// オープンをシェルに報告
			if(uri.match(/^\//)) {
				var u = "frs://" + uri; 
			} else {
				u = "frs:///" + uri;
			}  
			(new Flairy.Msg.Useres(u, Flairy.Kernel.pid)).postToKernel();

			// 現在のコンテントタイプを保存
			FlairyNotepad.currentDocCType = resp.getResponseHeader("Content-Type");
			callback(resp.responseText);
		},
		failure: function(resp, opt) {
			failback(resp);
		},
		disableCaching: true
	});


		},
		failure: function(resp, opt) {
			if (resp.status == 405) {
				Ext.MessageBox.alert("ロック非対応", "対象リソースシステムはロックに対応していません. そのため排他ロックは取得されませんでした.");
				
				// 本来の処理
				Flairy.Ajax.get("/~~flairy~~/res" + uri, {
					success: function(resp, opt){
						// オープンをシェルに報告
						if (uri.match(/^\//)) {
							var u = "frs://" + uri;
						}
						else {
							u = "frs:///" + uri;
						}
						(new Flairy.Msg.Useres(u, Flairy.Kernel.pid)).postToKernel();
						
						// 現在のコンテントタイプを保存
						FlairyNotepad.currentDocCType = resp.getResponseHeader("Content-Type");
						callback(resp.responseText);
					},
					failure: function(resp, opt){
						failback(resp);
					},
					disableCaching: true
				});
			} else {
				failback(resp);
			}
			
		},
		disableCaching: true
	});	
}

function write_res(uri, data, suc, mime) {
	if(!suc) { suc = function(){}; }
	if(!mime) { mime = Flairy.Mime.OCTET; }
	while(uri.indexOf("/") == 0) {
		uri = uri.substring(1);
	}
	Flairy.Ajax.putData("/~~flairy~~/res/" + uri, mime, data, {
		success: suc.createInterceptor(function(){
			(new Flairy.Msg.Notify("frs:///" + uri, Flairy.Kernel.pid)).post(Flairy.Kernel.env._KPID);
		}) ,
		failure: function(resp, opt) {
										var msg = Flairy.Res.Message.getMessage(resp.status, opt.method);
										if(!msg) {
											msg = "原因は不明です.";
										}
										Ext.Msg.alert("失敗", msg);
		}
	});
}
