enum PlanetState
{
	// Normal = 0,
	// Attack = "attack",
	// Defence = "defence",
	// Want = "want",
	// WantAttack = "attack.want",
	// WantDefence = "defence.want",

	// Normal = "normal",
	Attack = "attack",
	Defence = "defence",
	Want = "want",
	WantAttack = "attack.want",
	WantDefence = "defence.want",
}
enum FightGroup
{
	Planet = "planet",
	Ship = "ship",
}
enum WinType
{
	OccupyAll = "OccupyAll",
	OccupyOther = "OccupyOther",
	ReachFirst = "ReachFirst",
	TimeLimited = "TimeLimited",
}
enum GameState
{
	Prepare = "prepare",
	Gaming = "gaming",
	Failed = "failed",
	Win = "win",
}

function colorOfPlayer(idx) {
	if (idx===null) {
		return 0x808080;
	}
	else{
		return [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00][idx];
	}
}

function keys(obj) {
	let ret = [];
	for(let x in obj){
		ret.push(x);
	}
	return ret;
}

function findIndex(arr, func) {
	for(let x of arr){
		if(func(x))
			return arr.indexOf(x);
	}
	return -1;
}

function posof(obj) {
	return new egret.Point(obj.x, obj.y);
}

function pointMulti(v1: egret.Point, v2: egret.Point) {
	return v1.x*v2.x+v1.y*v2.y;
}

function gsc() {
	return Universe.inst.gsChecker;
}
function pc() {
	return Universe.inst.planetControl;
}

function checkNotify(funclist, userdata) {
	for(let func of funclist){
		func(userdata);
	}
}
