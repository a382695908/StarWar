
class DataCenter
{
	public player: Player = null;
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
		}
		
	}
}

let DC = new DataCenter();