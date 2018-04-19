
class NetEvent extends egret.Event
{
	public static MESSAGE = "NetEvent_MESSAGE";
	public id = 0;
	public msg = null;
	public constructor(){
		super(NetEvent.MESSAGE, false, false);
	}
}

class Network extends eui.Component
{
	private socket: egret.WebSocket = null;
	private history = new egret.ByteArray();
	constructor(){
		super();
	}
	init(){
        this.socket = new egret.WebSocket();
        this.socket.type = egret.WebSocket.TYPE_BINARY;
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        this.connectserver();
	}
    connectserver(){
        this.socket.connect('10.0.3.56', 7788);
    }
	private onReceiveMessage(evt: egret.Event):void {
        var byte: egret.ByteArray = new egret.ByteArray();
        this.socket.readBytes(this.history, this.history.length);
        while(true){
            let evt_dis = this.parse();
            if (!evt_dis)
                break;
            this.dispatchEvent(evt_dis);
        }
    }
    parse(){
    	this.history.position = 0;
    	if (this.history.length<8) {
    		// console.log('this.history.length<8');
    		return null;
    	}
    	else{
    		let msgid = this.history.readInt()
    		let msglen = this.history.readInt()
    		if (this.history.readAvailable<msglen) {
    			return null;
    		}
    		else{
    			let evt = new NetEvent();
    			evt.id = msgid;
    			evt.msg = ProtoType.decode(msgid, this.history);
    			this.removeUsedHistory(msglen+8);
    			return evt;
    		}
    	}
    }
    removeUsedHistory(usedlen){
    	this.history.position = usedlen;
    	let leftbyte = new egret.ByteArray();
    	this.history.readBytes(leftbyte);
		this.history = leftbyte;
		this.history.position = 0;
    }
    private onSocketOpen():void {
    }
    private onSocketClose(evt):void {
    }
    private onSocketError(evt):void {
        new NetError();
    }
	send(msgid, msg?){
		if (!this.socket.connected) {
            new Toast('网络未连接');
			return;
		}
		var msgByteArray = msg ? ProtoType.encode(msg) : new egret.ByteArray();
		var byte = new egret.ByteArray();
        byte.writeInt(msgid);
        byte.writeInt(msgByteArray.length);
        byte.writeBytes(msgByteArray, 0);
        byte.position = 0;
        this.socket.writeBytes(byte, 0, byte.bytesAvailable);
	}
}

let Net = new Network();