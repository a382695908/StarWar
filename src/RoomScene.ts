
class RoomScene extends eui.Component
{
	public ui_name0: eui.Label;
	public ui_name2: eui.Label;
	public ui_name1: eui.Label;
	public ui_name3: eui.Label;
	public ui_start: eui.Button;
	public ui_exit: eui.Button;
	private m_names: [eui.Label];
	constructor(){
		super();
		this.skinName = "resource/config/room.exml";
		this.configUI();
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	$onRemoveFromStage(){
		super.$onRemoveFromStage();
		Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	configUI(){
		this.m_names = [this.ui_name0, this.ui_name1, this.ui_name2, this.ui_name3];
		this.ui_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick_ui_start, this);
		this.ui_exit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick_ui_exit, this);
	}
	refreshByRoomMsg(room){
		for(let i=0; i<4; ++i){
			let player = room.members[i];
			if(!player){
				this.m_names[i].text = '';
			}
			else{
				this.m_names[i].text = `${player.name}(${player.id})`;
			}
		}
		this.ui_start.visible = room.members.length>1 && (room.members[0].id===DC.player.id);
	}
	onMessage(evt: NetEvent){
		switch(evt.id)
		{
			case ProtoType.U_UPDATE_ROOM:
				this.refreshByRoomMsg(evt.msg);
			break;
		}
	}
	public onClick_ui_start(evt: egret.TouchEvent){
		Net.send(ProtoType.START_GAME);
	}
	public onClick_ui_exit(evt: egret.TouchEvent){
		Net.send(ProtoType.EXIT_ROOM);
	}
}