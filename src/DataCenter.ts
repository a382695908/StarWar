
class DataCenter
{
	public player = null;
	// public room: Room = null;
	public battle: BattleController = null;
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
			case ProtoType.U_BATTLE_START:
			{
				new Universe(evt.msg);
				this.battle = new BattleController(evt.msg);
			}
			break;
			case ProtoType.U_START_SYNC:
			{
				let scene = new SyncScene();
				scene.refreshView(evt.msg);
			}
			break;
		}
		
	}
}

let DC = new DataCenter();