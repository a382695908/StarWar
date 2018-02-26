
class ProtoBase
{
	protected static root = null;
	protected proto_data = null;
	protected clazz = null;
	constructor(){
		if (!ProtoBase.root) {
			let content = RES.getRes("protoall_proto");
			// console.log(content);
			ProtoBase.root = dcodeIO.ProtoBuf.loadProto( content );
		}
	}
	encode(): egret.ByteArray {
		return new egret.ByteArray( this.proto_data.toArrayBuffer() );
	}
	decode(bytes: egret.ByteArray){
		this.proto_data = this.clazz.decode(bytes.rawBuffer);
	}
}

class Player extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("Player");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "Player"+this.proto_data.encodeJSON();
	}
	
	get id() { return this.proto_data.id; }
	set id(val: number) { this.proto_data.id=val; }

	get name() { return this.proto_data.name; }
	set name(val: string) { this.proto_data.name=val; }

	get head() { return this.proto_data.head; }
	set head(val: string) { this.proto_data.head=val; }

	get camp() { return this.proto_data.camp; }
	set camp(val: number) { this.proto_data.camp=val; }

}


class Room extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("Room");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "Room"+this.proto_data.encodeJSON();
	}
	
	get members() { return this.proto_data.members; }
	set members(val: Player) { this.proto_data.members=val; }

}


class Result extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("Result");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "Result"+this.proto_data.encodeJSON();
	}
	
	get errid() { return this.proto_data.errid; }
	set errid(val: number) { this.proto_data.errid=val; }

	get errmsg() { return this.proto_data.errmsg; }
	set errmsg(val: string) { this.proto_data.errmsg=val; }

}


class ForceScene extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("ForceScene");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "ForceScene"+this.proto_data.encodeJSON();
	}
	
	get scenename() { return this.proto_data.scenename; }
	set scenename(val: string) { this.proto_data.scenename=val; }

}


class BattleStart extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("BattleStart");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "BattleStart"+this.proto_data.encodeJSON();
	}
	
	get mapid() { return this.proto_data.mapid; }
	set mapid(val: number) { this.proto_data.mapid=val; }

}


class UpdateTurn extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("UpdateTurn");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "UpdateTurn"+this.proto_data.encodeJSON();
	}
	
	get turn() { return this.proto_data.turn; }
	set turn(val: number) { this.proto_data.turn=val; }

}


class PlanetCommand extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("PlanetCommand");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "PlanetCommand"+this.proto_data.encodeJSON();
	}
	
	get fromid() { return this.proto_data.fromid; }
	set fromid(val: number) { this.proto_data.fromid=val; }

	get toid() { return this.proto_data.toid; }
	set toid(val: number) { this.proto_data.toid=val; }

}


class OneTurn extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("OneTurn");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "OneTurn"+this.proto_data.encodeJSON();
	}
	
	get index() { return this.proto_data.index; }
	set index(val: number) { this.proto_data.index=val; }

	get pcmds() { return this.proto_data.pcmds; }
	set pcmds(val: PlanetCommand) { this.proto_data.pcmds=val; }

}


class MultiTurn extends ProtoBase
{
	constructor(){
		super();
		this.clazz = ProtoBase.root.build("MultiTurn");
		this.proto_data = new this.clazz({});
	}
	toString(){
		return "MultiTurn"+this.proto_data.encodeJSON();
	}
	
	get turns() { return this.proto_data.turns; }
	set turns(val: OneTurn) { this.proto_data.turns=val; }

}

