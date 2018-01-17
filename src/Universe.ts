class Universe extends eui.Component
{
	public ui_level_name: eui.Label;
	public ui_bg: egret.Bitmap;

	public static inst: Universe = null;
	private countries: Country[] = [];
	public activeCountry: Country = null;
	public planetControl: PlanetControl = null;
	public gsChecker: GameStateChecker = null;

	constructor(){
		super();
		this.skinName = "resource/config/universe.exml";
		Universe.inst = this;
		this.configUI();
		// let s = new State();
		// s.onchange = (state)=>{
		// 	console.log(state.toString());
		// };
		// s.add("attack");
		// s.rm("attack.want");

	}
	activePlanet() {
		return this.planetControl.activePlanet;
	}
	private clear(){
		// this.activePlanet = null;
	}
	private configUI(){
		this.ui_level_name.anchorOffsetX = this.ui_level_name.width/2;
		this.ui_level_name.x = this.width/2;
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
		for(let cname of [null, "zhang", "li"]){
			let c = new Country();
			c.name = cname;
			c.color = cname?randcolor():0xFFFFFF;
			this.countries.push(c);
		}
		this.activeCountry = this.getCountryByName('zhang');
		for(let pconf of lelconf.planets)
		{
			let p = new Planet();
			p.reloadByConfig(pconf);
			this.planetControl.addFightObject(p);
		}
		this.gsChecker.reloadByConfig(lelconf.winCondition);
	}
	getCountryByName(name: String): Country{
		for(let c of this.countries){
			if(c.name === name){
				return c;
			}
		}
		return null;
	}
}