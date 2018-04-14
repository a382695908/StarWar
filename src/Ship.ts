class Ship extends eui.Component implements FightObject
{
	public from: Planet;
	public to: Planet;
	private moveTimer = null;
	constructor(){
		super();
		this.skinName = "resource/eui_skins/ship.exml";
		this.configUI();
		this.moveTimer = new egret.Timer(16.6, 0);
		this.moveTimer.addEventListener(egret.TimerEvent.TIMER, this.checkMove, this);
		this.moveTimer.start();
	}
	group(){
		return FightGroup.Ship;
	}
	configUI(){
		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height/2;
	}
	reloadByConfig(conf){
		let cur = new egret.Point(0, 1);
		let tar = posof(this.to).subtract( posof(this) );
		tar.y = -tar.y;
		tar.normalize(1);
		let cosAngle = pointMulti(cur, tar);
		let angle = Math.acos(cosAngle)*180/Math.PI;
		this.rotation = tar.x<0 ? -angle : angle;
	}
	$onRemoveFromStage(){
		this.moveTimer.stop();
		this.moveTimer = null;
		super.$onRemoveFromStage();
	}
	checkMove(){
		if (this.checkArrived()) {
			return;
		}
		let fp = new egret.Point(this.x, this.y);
		let tp = new egret.Point(this.to.x, this.to.y);
		let ds = tp.subtract(fp)
		ds.normalize(3);
		let next = fp.add(ds);
		this.x = next.x;
		this.y = next.y;
	}
	checkArrived(): boolean{
		if (!this.to.isShipArrived(this))
			return false;
		this.to.onhit(this);
		Universe.inst.planetControl.rmFightObject(this);
		return true;
	}
}