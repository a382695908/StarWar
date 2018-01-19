
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

