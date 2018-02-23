namespace ProtoType{

	export let CREATE_PLAYER = 0x0001;
	export let U_CREATE_PLAYER_ERROR = 0x0002;
	export let U_CREATE_PLAYER = 0x0003;
	export let START_MATCH = 0x0004;
	export let U_START_MATCH = 0x0005;
	export let CANCEL_MATCH = 0x0006;
	export let U_CANCEL_MATCH = 0x0007;
	export let U_UPDATE_ROOM = 0x0008;
	export let U_CREATE_ROOM = 0x0009;
	export let EXIT_ROOM = 0x000a;
	export let START_GAME = 0x000b;
	export let U_START_GAME = 0x000c;
	export let U_FORCE_SCENE = 0x000d;

	export function createProto(msgid){
		switch (msgid) {
			case CREATE_PLAYER: return new Player();
			case U_CREATE_PLAYER_ERROR: return new Result();
			case U_CREATE_PLAYER: return new Player();

			case U_START_MATCH: return new Result();

			case U_CANCEL_MATCH: return new Result();
			case U_UPDATE_ROOM: return new Room();
			case U_CREATE_ROOM: return new Room();



			case U_FORCE_SCENE: return new ForceScene();
			default: return null;
		}
	}
}