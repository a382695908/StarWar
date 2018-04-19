
class Register extends eui.Component
{
	public ui_start: eui.Button;
	public ui_name: eui.TextInput;
	public ui_cancel: eui.Button;
	public ui_matching: eui.Label;
	widget = null;
	constructor(){
		super();
		this.skinName = "resource/eui_skins/register.exml";
		this.configUI();
		this.ui_cancel.visible = false;
		this.ui_matching.visible = false;
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
		if (DC.player) {
			this.ui_name.enabled = false;
			this.ui_name.text = DC.player.name;
		}
		this.widget = new Widget(this);
		this.widget.single();
	}
	$onRemoveFromStage(){
		super.$onRemoveFromStage();
		Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	configUI(){
		this.ui_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick_ui_start, this);
		this.ui_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick_ui_cancel, this);
	}
	validName(name){
		if (name.length===0 || name.length>6) {
			return false;
		}
		if (name.indexOf(' ')>=0) {
			return false;
		}
		return true;
	}
	public onClick_ui_start(evt: egret.TouchEvent){
		if (!this.validName(this.ui_name.text)) {
			// Main.inst.toast('输入合法名字(1-6个字不含空格)');
			new Toast('输入合法名字(1-6个字不含空格)');
			return;
		}
		this.ui_name.enabled = false;
		this.ui_start.visible = false;
		this.ui_cancel.visible = true;
		if (DC.player) {
			this.startMatch();
		}
		else{
			let msg = ProtoType.create('Player');
			msg.name = this.ui_name.text;
			Net.send(ProtoType.CREATE_PLAYER, msg);
		}
	}
	startMatch(){
		let msg = ProtoType.create('StartMatch');
		msg.want = 2;
		Net.send(ProtoType.START_MATCH, msg);
	}
	public onClick_ui_cancel(evt: egret.TouchEvent){
		Net.send(ProtoType.CANCEL_MATCH, null);
	}
	onMessage(evt: NetEvent){
		switch(evt.id)
		{
			case ProtoType.U_CREATE_PLAYER:
			{
				this.ui_name.text = DC.player.name;
				this.ui_name.enabled = false;
				this.startMatch();
			}
			break;
			case ProtoType.U_CREATE_PLAYER_ERROR:
			{
				this.ui_name.enabled = true;
				this.ui_start.visible = true;
				this.ui_cancel.visible = false;
				new Toast(evt.msg.resmsg);
			}
			break;
			case ProtoType.U_START_MATCH:
			{
				if (evt.msg.resid)
				{
					this.ui_name.enabled = true;
					this.ui_start.visible = true;
					this.ui_cancel.visible = false;
				}
				else
				{
					new Toast(evt.msg.resmsg.toString());
					this.ui_matching.visible = true;
				}
			}
			break;
			case ProtoType.U_CANCEL_MATCH:
				this.ui_name.enabled = true;
				this.ui_start.visible = true;
				this.ui_cancel.visible = false;
				this.ui_matching.visible = false;
				new Toast(evt.msg.toString());
			break;
		}
	}
}