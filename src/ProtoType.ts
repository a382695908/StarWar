let ProtoBase_root = null;
namespace ProtoType{
	function protobase(){
		if(!ProtoBase_root){
			let content = RES.getRes("protoall_proto");
			ProtoBase_root = dcodeIO.ProtoBuf.loadProto( content );
		}
		return ProtoBase_root;
	}
	function msgid2clazz(msgid){
		switch(msgid){
			case ProtoType.CREATE_PLAYER: return protobase().build("Player");
			case ProtoType.U_UPDATE_PLAYER: return protobase().build("Player");
			case ProtoType.U_CREATE_PLAYER_ERROR: return protobase().build("Result");
			case ProtoType.U_CREATE_PLAYER: return protobase().build("Player");
			case ProtoType.START_MATCH: return protobase().build("StartMatch");
			case ProtoType.U_START_MATCH: return protobase().build("Result");

			case ProtoType.U_CANCEL_MATCH: return protobase().build("Result");
			case ProtoType.U_BATTLE_START: return protobase().build("BattleStart");
			case ProtoType.PLANET_COMMAND: return protobase().build("PlanetCommand");
			case ProtoType.U_PLANET_COMMAND: return protobase().build("MultiTurn");
			case ProtoType.UPDATE_TURN: return protobase().build("UpdateTurn");

			case ProtoType.U_START_SYNC: return protobase().build("StartSync");
			case ProtoType.SYNC_MEMBER: return protobase().build("SyncMember");
			case ProtoType.U_SYNC_MEMBER: return protobase().build("SyncMember");

			default: return null;
		}
	}

	export let CREATE_PLAYER = 0x0001;
	export let U_UPDATE_PLAYER = 0x0002;
	export let U_CREATE_PLAYER_ERROR = 0x0003;
	export let U_CREATE_PLAYER = 0x0004;
	export let START_MATCH = 0x0005;
	export let U_START_MATCH = 0x0006;
	export let CANCEL_MATCH = 0x0007;
	export let U_CANCEL_MATCH = 0x0008;
	export let U_BATTLE_START = 0x0009;
	export let PLANET_COMMAND = 0x000a;
	export let U_PLANET_COMMAND = 0x000b;
	export let UPDATE_TURN = 0x000c;
	export let U_NET_CHECK = 0x000d;
	export let U_START_SYNC = 0x000e;
	export let SYNC_MEMBER = 0x000f;
	export let U_SYNC_MEMBER = 0x0010;
	export let SYNC_FINISH = 0x0011;

	export function create(msgid_or_name){
		if(typeof(msgid_or_name)==='number'){
			return new (msgid2clazz(msgid_or_name))({});
		}
		else{
			return new (protobase().build(msgid_or_name))({});
		}
	}
	export function encode(proto){
		return new egret.ByteArray( proto.toArrayBuffer() );
	}
	export function decode(msgid, bytes){
		let clazz = msgid2clazz(msgid);
		return clazz ? clazz.decode(bytes.rawBuffer) : null;
	}
}
