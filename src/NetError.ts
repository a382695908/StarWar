class NetError extends eui.Component
{
	public ui_exit: eui.Button;
	widget = null;
	public constructor() {
		super();
		this.skinName = "resource/eui_skins/neterror.exml";
		this.ui_exit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick_ui_exit, this);
		this.widget = new Widget(this);
		this.widget.alert();
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}

	$onRemoveFromStage(){
		super.$onRemoveFromStage();
		Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}

	public onClick_ui_exit(evt: egret.TouchEvent){
		this.ui_exit.enabled = false;
		Net.connectserver();
	}
	
	onMessage(evt: NetEvent){
		switch(evt.id){
			case ProtoType.U_NET_CHECK:
				DC.player = null;
				this.widget.close();
				new Register();
			break;
		}
	}	
}