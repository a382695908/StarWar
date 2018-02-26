class PlanetControl extends eui.UILayer
{
	// private planets: Planet[] = [];
	private fobjs = {};
	public activePlanet: Planet = null;
	private lastTouchPlanet: Planet = null;
	private history = [];
	private turn = 0;
	constructor(){
		super();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
		this.touchEnabled = true;
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	$onRemoveFromStage(){
		super.$onRemoveFromStage();
		Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	addFightObject(obj: FightObject){
		if (keys(this.fobjs).indexOf(obj.group())<0) {
			this.fobjs[ obj.group() ] = [];
		}
		this.fobjs[ obj.group() ].push( obj );
		this.addChild( <any>obj );
	}
	rmFightObject(obj: FightObject){
		let all = this.fobjs[ obj.group() ];
		if(all.indexOf(obj)<0){
			return;
		}
		all.splice(all.indexOf(obj), 1);
		this.removeChild(<any>obj);
	}
	fightObject(group: FightGroup){
		return this.fobjs[group];
	}
	onTouchTap(event: egret.TouchEvent){
		// let p = posof(this.planets[0]);
		// let g = this.localToGlobal(p.x, p.y);
		// let t = this.globalToLocal(g.x, g.y);
		// console.log(p, g, t);
		// this.fobjs["ship"][0].checkMove();
	}
	onTouchBegin(event: egret.TouchEvent){
		if (this.activePlanet) {
			console.log('multi touch error');
			return;
		}
		let curPlanet = this.getPlanetByTouch(new egret.Point(event.stageX,event.stageY));
		if(!curPlanet)
			return;
		if (curPlanet.camp !== DC.player.camp){
			console.log('无法控制:', curPlanet.camp, DC.player.camp);
			return;
		}
		this.activePlanet = this.lastTouchPlanet = curPlanet;
		this.lastTouchPlanet.onTouchEnter();
	}
	onTouchMove(event: egret.TouchEvent){
		if(!this.activePlanet)
			return;
		let curPlanet = this.getPlanetByTouch(new egret.Point(event.stageX,event.stageY));
		if (curPlanet === this.lastTouchPlanet) {
			if (this.lastTouchPlanet) {
				this.lastTouchPlanet.onTouchMove();
			}
		}
		else if(curPlanet === null) {
			if (this.lastTouchPlanet) {
				this.lastTouchPlanet.onTouchOut();
				this.lastTouchPlanet = null;
			}
		}
		else{
			if (this.lastTouchPlanet) {
				this.lastTouchPlanet.onTouchOut();
			}
			this.lastTouchPlanet = curPlanet;
			this.lastTouchPlanet.onTouchEnter();
		}
	}
	onTouchEnd(event: egret.TouchEvent){
		if(!this.activePlanet)
			return;
		let curPlanet = this.getPlanetByTouch(new egret.Point(event.stageX,event.stageY));
		if (curPlanet) {
			curPlanet.onTouchEnd();
		}
		else{
			this.activePlanet.onTouchEnd();
		}

		let p = this.activePlanet;
		this.activePlanet = null;
		p.onStateChanged(p.state);
	}
	onTouchCancel(event: egret.TouchEvent){
		if(!this.activePlanet)
			return;
		this.activePlanet.onTouchEnd();
		this.activePlanet = null;
	}
	getPlanetByTouch(pos){
		for(let p of this.fobjs[ FightGroup.Planet ]){
			if (p.getTransformedBounds(this).containsPoint(pos)) {
				return p;
			}
		}
		return null;
	}
	applyHistory(){
		let turn = this.history.shift();
		console.log('应用turn', turn.index);
		let planets = this.fightObject(FightGroup.Planet);
		for(let cmd of turn.pcmds){
			planets[cmd.fromid].fight(planets[cmd.toid]);
		}
		this.turn = turn.index+1;

		let msg = new UpdateTurn();
		msg.turn = this.turn;
		Net.send(ProtoType.UPDATE_TURN, msg);
	}
	onMessage(evt: NetEvent){
		switch(evt.id)
		{
			case ProtoType.U_BATTLE_START:
			{
				this.turn = 0;
				this.history = [];
			}
			break;
			case ProtoType.U_PLANET_COMMAND:
			{
				for(let turn of evt.msg.turns){
					if (turn.index<this.turn) {
						console.log('丢弃轮', turn.index, this.turn);
						continue;
					}
					this.history.push(turn);
				}
				// console.log('历史记录', this.history.length);
				this.applyHistory();
			}
			break;
		}
	}
}