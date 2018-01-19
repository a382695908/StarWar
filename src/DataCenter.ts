
class DataCenter
{
	public hero: Player = null;
	init(){
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	// clear(){
	// 	Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	// }
	onMessage(evt: NetEvent)
	{
	
	}
}

let DC = new DataCenter();