class GameStateChecker extends eui.Component
{
	public onchange = [];
	private winCond = null;
	private gs = new State();
	constructor(){
		super();
		egret.startTick(this.checkState, this);
	}
	clear(){

	}
	reloadByConfig(cond){
		this.clear();
		this.winCond = cond;
	}
	checkState(): boolean {
		switch (this.winCond.type) {
			case WinType.OccupyAll:
				this.checkOccupyAll();
				break;
			case WinType.OccupyOther:
				this.checkOccupyOther();
				break;
			case WinType.ReachFirst:
				this.checkReachFirst();
				break;
			case WinType.TimeLimited:
				this.checkTimeLimited();
				break;
		}
		return false;
	}
	checkOccupyAll(){
		// if( pc().fightObject(FightGroup.Ship).length > 0 )
		// 	return;
		// let planets = pc().fightObject(FightGroup.Planet);
		// let win = true;
		// let fail = true;
		// for(let p of planets)
		// {
		// 	if (p.country===Universe.inst.activeCountry) {
		// 		fail = false;
		// 	}
		// 	else{
		// 		win = false;
		// 	}
		// 	if (win) {
		// 		// code...
		// 	}
		// }
	}
	checkOccupyOther(){

	}
	checkReachFirst(){

	}
	checkTimeLimited(){

	}
}