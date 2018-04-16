class NetError extends eui.Component
{
	public ui_exit: eui.Button;
	public constructor() {
		super();
		this.skinName = "resource/eui_skins/neterror.exml";
		this.ui_exit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick_ui_exit, this);
	}

	$onRemoveFromStage()
	{
		super.$onRemoveFromStage();
	}

	public onClick_ui_exit(evt: egret.TouchEvent){
		let scene = new Register();
        Main.inst.replaceChild(scene);
        // Main.inst.removeChild(this);
	}
	
}