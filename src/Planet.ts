class Planet extends eui.Component implements FightObject
{
	public ui_img: eui.Image;
	public ui_ship_num: eui.Label;
	public ui_frame: eui.Rect;
	public ui_focus: eui.Rect;

	public state = new State();
	private curShip = 0;
	public country: Country = null;
	private accTimer = null;
	private fights: FightMsg[] = [];
	private createShipTimer = null;

	constructor(){
		super();
		this.skinName = "resource/config/planet.exml";
		this.state.onchange.push(this.onStateChanged.bind(this));
		this.configUI();
		// egret.startTick(this.checkFightOther, this);
		this.createShipTimer = new egret.Timer(100, 0);
		this.createShipTimer.addEventListener(egret.TimerEvent.TIMER, this.checkFightOther, this);
		this.createShipTimer.start();
	}
	$onRemoveFromStage(){
		this.createShipTimer.stop();
		this.createShipTimer = null;
		super.$onRemoveFromStage();
	}
	configUI(){
		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height/2;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}
	group(){
		return FightGroup.Planet;
	}
	clear(){
		this.state.clear();
		if (this.accTimer) {
			this.accTimer.stop();
			this.accTimer = null;
		}
	}
	reloadByConfig(conf){
		this.clear();
		this.x = conf.x;
		this.y = conf.y;
		this.name = conf.name;
		this.accTimer = new egret.Timer(conf.genTime || 1, 0);
		this.accTimer.addEventListener(egret.TimerEvent.TIMER, this.onAccShip, this);
		this.accTimer.start();
		this.setCurShip(conf.initialShip || 0);
		this.country = Universe.inst.getCountryByName(conf.country);
		this.ui_img.texture = RES.getRes(conf.texname);
		this.ui_frame.strokeColor = this.country.color;
	}
	setCurShip(num){
		this.curShip = num;
		this.ui_ship_num.text = num.toString();
	}
	onAccShip(event: egret.TimerEvent) {
        this.setCurShip(this.curShip+1);
    }
    onTouchTap(event: egret.TouchEvent){
    	// console.log('planet:', this.getTransformedBounds(this.parent));
    }
    onTouchEnter(){
    	if (Universe.inst.activePlanet()===this) {
    		this.state.add(PlanetState.WantAttack);
    	}
    	else{
    		this.state.add(PlanetState.WantDefence);
    	}
    }
    onTouchMove(){

    }
    onTouchOut(){
    	if (Universe.inst.activePlanet()===this) {
    		this.state.rm(PlanetState.WantAttack);
    	}
    	else{
    		this.state.rm(PlanetState.WantDefence);
    	}
    }
    onTouchEnd(){
    	if (Universe.inst.activePlanet()===this) {
    		this.state.rm(PlanetState.WantAttack);
    	}
    	else{
    		this.state.rm(PlanetState.WantDefence);
    		Universe.inst.activePlanet().state.add(PlanetState.Attack);
    		this.state.add(PlanetState.Defence);
    		Universe.inst.activePlanet().fight(this);
    	}
    }
    onStateChanged(state){
    	if (state.empty() && Universe.inst.activePlanet()!==this) {
    		this.ui_focus.visible = false;
    	}
    	else{
    		this.ui_focus.visible = true;	
    	}
    }
    fight(planet: Planet){
    	console.log(this.name, 'fight', planet.name, Math.floor(this.curShip/2));
    	this.fights.push(new FightMsg(planet, Math.floor(this.curShip/2)));
    	// this.fights.push(new FightMsg(planet, 1));
    }
    onhit(ship: Ship){
    	if (ship.from.country===this.country) {
    		this.setCurShip(this.curShip+1);
    	}
    	else{
    		this.setCurShip(this.curShip-1);
    	}
    }
    checkFightOther(): boolean {
    	if (this.fights.length===0)
    		return false;

    	for(let fm of this.fights){
    		if (this.curShip===0)
    			break;
    		this.setCurShip(this.curShip-1);
    		fm.num -= 1;
    		Universe.inst.planetControl.addFightObject(this.createShip(fm.target));
    	}

    	if (this.curShip===0){
    		this.state.rmall(PlanetState.Attack);
    		for(let fm of this.fights){
    			fm.target.state.rm(PlanetState.Defence);
    		}
    		this.fights = [];
    	}
    	else{
    		while(true){
    			let pdx = findIndex(this.fights, (x)=>x.num===0);
    			if (pdx<0)
    				break;
    			this.state.rm(PlanetState.Attack);
    			this.fights[pdx].target.state.rm(PlanetState.Defence);
    			this.fights.splice(pdx, 1);
    		}
    	}
    	return false;
    }
    createShip(target: Planet){
    	let s = new Ship();
    	s.from = this;
    	s.to = target;
    	s.x = this.x + randint()%this.width-this.width/2;
    	s.y = this.y + randint()%this.height-this.height/2;
    	s.reloadByConfig({});
    	return s;
    }
    isShipArrived(ship: Ship): boolean{
    	let g = ship.localToGlobal(ship.width/2, ship.height/2);
		let t = this.globalToLocal(g.x, g.y);
		let rc = new egret.Rectangle(0, 0, this.width, this.height);
		return rc.containsPoint(t);
    }
}

class FightMsg
{
	// public target: Planet;
	// public shipnum: number;
	constructor(public target, public num){

	}
}