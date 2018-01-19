
class Register extends eui.Component
{
	public ui_start: eui.Button;
	public ui_name: eui.TextInput;
	public ui_cancel: eui.Button;
	public ui_matching: eui.Label;
	constructor(){
		super();
		this.skinName = "resource/config/register.exml";
		this.configUI();
		this.ui_cancel.enabled = false;
		this.ui_matching.visible = false;
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
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
			Main.inst.toast('输入合法名字(1-6个字不含空格)');
			return;
		}
		this.ui_name.enabled = false;
		this.ui_start.enabled = false;
		this.ui_cancel.enabled = true;
		this.ui_matching.visible = true;
		let msg = new StartMatchMsg();
		msg.name = this.ui_name.text;
		Net.send(ProtoType.START_MATCH, msg);
	}
	public onClick_ui_cancel(evt: egret.TouchEvent){
		let msg = new StartMatchMsg();
		msg.name = this.ui_name.text;
		Net.send(ProtoType.CANCEL_MATCH, msg);
	}
	onMessage(evt: NetEvent){
		switch(evt.id)
		{
			case ProtoType.U_START_MATCH:
			{
				if (evt.msg.errid)
				{
					this.ui_name.enabled = true;
					this.ui_start.enabled = true;
					this.ui_cancel.enabled = false;
					Main.inst.toast(evt.msg.errmsg.toString());
				}
				else
				{
					Main.inst.toast('匹配成功');
				}
				this.ui_matching.visible = false;
			}
			break;
			case ProtoType.U_CANCEL_MATCH:
				this.ui_name.enabled = true;
				this.ui_start.enabled = true;
				this.ui_cancel.enabled = false;
				this.ui_matching.visible = false;
				Main.inst.toast(evt.msg.toString());
			break;
		}
	}
}