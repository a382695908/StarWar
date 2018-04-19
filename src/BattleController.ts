class BattleController
{
	public startinfo = null;
	constructor(startinfo){
		this.startinfo = startinfo;
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	clear(){
		Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	me(){
		for(let p of this.startinfo.members){
			if(p.player.id===DC.player.id){
				return p; 
			}
		}
		return null;
	}
	onMessage(evt: NetEvent)
	{

	}
}