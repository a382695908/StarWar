#!/bin/python

import re

filetemp = '''\
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
MSGID2CLASS
			default: return null;
		}
	}

PROTOTYPETT

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
'''


def create_ProtoType(data):
	result = [ '\texport let %s = 0x%04x;'%(name, idx+1) for idx,(name, proto) in enumerate(data)]
	return '\n'.join(result)
def create_msgid2classname(data):
	result = [ '\t\t\tcase ProtoType.%s: return protobase().build("%s");'%(name, proto) if proto else '' for idx,(name, proto) in enumerate(data)]
	result = '\n'.join(result);
	return result

def gen_msgid(out):
	global filetemp
	data = [
		['CREATE_PLAYER', 'Player'],
		['U_UPDATE_PLAYER', 'Player'],
		['U_CREATE_PLAYER_ERROR', 'Result'],
		['U_CREATE_PLAYER', 'Player'],
		['START_MATCH', 'StartMatch'],
		['U_START_MATCH', 'Result'],
		['CANCEL_MATCH', ''],
		['U_CANCEL_MATCH', 'Result'],
		['U_BATTLE_START', 'BattleStart'],
		['PLANET_COMMAND', 'PlanetCommand'],
		['U_PLANET_COMMAND', 'MultiTurn'],
		['UPDATE_TURN', 'UpdateTurn'],
		['U_NET_CHECK', ''],
		['U_START_SYNC', 'StartSync'],
		['SYNC_MEMBER', 'SyncMember'],
		['U_SYNC_MEMBER', 'SyncMember'],
		['SYNC_FINISH', ''],
	]
	fout = open(out, 'w');
	filetemp = filetemp.replace('MSGID2CLASS', create_msgid2classname(data))
	filetemp = filetemp.replace('PROTOTYPETT', create_ProtoType(data))
	fout.write(filetemp)
	fout.close();
def main():
	gen_msgid('src/ProtoType.ts')


main()