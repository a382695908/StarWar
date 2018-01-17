class PlanetControl extends eui.UILayer
{
	// private planets: Planet[] = [];
	private fobjs = {};
	public activePlanet: Planet = null;
	private lastTouchPlanet: Planet = null;
	constructor(){
		super();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
		this.touchEnabled = true;
	}
	// addPlanet(planet){
	// 	this.planets.push(planet);
	// 	this.addChild(planet);
	// }
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
		if (curPlanet.country !== Universe.inst.activeCountry)
			return;
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
}