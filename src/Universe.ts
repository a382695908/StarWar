
class Universe extends eui.Component
{
	public ui_level_name: eui.Label;
	public ui_bg: egret.Bitmap;

	public static inst: Universe = null;
	public planetControl: PlanetControl = null;
	public gsChecker: GameStateChecker = null;
	widget = null;
	constructor(battlestart){
		super();
		this.skinName = "resource/eui_skins/universe.exml";
		Universe.inst = this;
		this.configUI();
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
		this.reloadByConfig(battlestart.mapid);
		this.widget = new Widget(this);
		this.widget.single();
	}
	$onRemoveFromStage(){
		super.$onRemoveFromStage();
		Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	activePlanet() {
		return this.planetControl.activePlanet;
	}
	private clear(){
	}
	private configUI(){
		this.planetControl = new PlanetControl();
		this.addChild(this.planetControl);
		this.gsChecker = new GameStateChecker();
		this.addChild(this.gsChecker);
	}
	reloadByConfig(config_index: number){
		this.clear();
		let lelname = `level${config_index}_json`;
		let lelconf = RES.getRes(lelname);
		egret.assert(lelconf);
		this.ui_level_name.text = lelconf.name;
		this.ui_bg.texture = RES.getRes(lelconf.bgName);
		for(let pconf of lelconf.planets)
		{
			let p = new Planet();
			p.reloadByConfig(pconf);
			p.id = lelconf.planets.indexOf(pconf);
			this.planetControl.addFightObject(p);
		}
		this.gsChecker.reloadByConfig(lelconf.winCondition);
	}
	onMessage(evt: NetEvent){
		switch(evt.id)
		{
			// case ProtoType.U_BATTLE_START:
			// 	eggtool.seed = evt.msg.randseed;
			// 	this.reloadByConfig(evt.msg.mapid);
			// break;
		}
	}
}