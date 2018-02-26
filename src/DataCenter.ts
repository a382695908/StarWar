
class DataCenter
{
	public player: Player = null;
	public room: Room = null;
	init(){
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	// clear(){
	// 	Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	// }
	onMessage(evt: NetEvent)
	{
		switch (evt.id) {
			case ProtoType.U_CREATE_PLAYER:
			{
				this.player = evt.msg;
			}
			break;
			case ProtoType.U_UPDATE_PLAYER:
			{
				this.player = evt.msg;	
			}
			break;
			case ProtoType.U_CREATE_ROOM:
			{
				let scene = new RoomScene();
				scene.refreshByRoomMsg(evt.msg);
				Main.inst.replaceChild(scene);
			}
			break;
			case ProtoType.U_FORCE_SCENE:
			{
				console.log(`force enter ${evt.msg.scenename}`);
				let scene = eval(`new ${evt.msg.scenename}()`);
				egret.assert(scene);
				Main.inst.replaceChild(scene);
			}
			break;
			case ProtoType.U_START_GAME:
			{
				let scene = new Universe();
				// scene.reloadByConfig(0);
				Main.inst.replaceChild(scene);
			}
			break;
			case ProtoType.U_UPDATE_ROOM:
			{
				this.room = evt.msg;
			}
			break;
		}
		
	}
}

let DC = new DataCenter();