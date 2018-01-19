namespace ProtoType{

	export let START_MATCH = 0x0000;
	export let U_START_MATCH = 0x0001;
	export let CANCEL_MATCH = 0x0002;
	export let U_CANCEL_MATCH = 0x0003;

	export function createProto(msgid){
		switch (msgid) {
			case START_MATCH: return new StartMatchMsg();
			case U_START_MATCH: return new ResultMsg();
			case CANCEL_MATCH: return new StartMatchMsg();
			case U_CANCEL_MATCH: return new ResultMsg();
			default: return null;
		}
	}
}