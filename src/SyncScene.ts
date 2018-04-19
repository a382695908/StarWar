
class SyncScene extends eui.Component
{
	public ui_name0: eui.Label;
	public ui_name2: eui.Label;
	public ui_name1: eui.Label;
	public ui_name3: eui.Label;
	public ui_percent0: eui.Label;
	public ui_percent2: eui.Label;
	public ui_percent1: eui.Label;
	public ui_percent3: eui.Label;
	private m_names: [eui.Label];
	private m_percents: [eui.Label];
	widget = null;
	startsync = null;
	constructor(){
		super();
		this.skinName = "resource/eui_skins/xuanzhan.exml";
		this.m_names = [this.ui_name0, this.ui_name1, this.ui_name2, this.ui_name3];
		this.m_percents = [this.ui_percent0, this.ui_percent1, this.ui_percent2, this.ui_percent3];
		Net.addEventListener(NetEvent.MESSAGE, this.onMessage, this);
		this.widget = new Widget(this);
		this.widget.single();
	}
	$onRemoveFromStage(){
		super.$onRemoveFromStage();
		Net.removeEventListener(NetEvent.MESSAGE, this.onMessage, this);
	}
	refreshView(startsync){
		this.startsync = startsync;
		for(let i=0; i<4; ++i){
			this.m_percents[i].text = '0%';
			if(!startsync.members[i]){
				this.m_names[i].text = '[EMPTY]';
			}
			else{
				this.m_names[i].text = startsync.members[i].name;
			}
		}
		this.checkLoadResource(startsync.mapid);
	}
	checkLoadResource(mapid){
		let lelname = `level${mapid}_json`;
		let lelconf = RES.getRes(lelname);
		let needload = [lelconf.bgName];
		for(let planet of lelconf.planets){
			needload.push(planet.texname);
		}
		let loadindex = 0;

		let onCompleteOne = function(data, key){
			if (loadindex===needload.length) {
				return;
			}
			console.log('lidx', loadindex, key);
			loadindex = loadindex+1;
			let tm = new egret.Timer(500, 1);
			tm.addEventListener(egret.TimerEvent.TIMER, ()=>{
				RES.getResAsync(needload[loadindex], onCompleteOne, this);
			}, this);
			tm.start();
		};
		RES.getResAsync(needload[0], onCompleteOne, this);

		let checkFinish = function(evt){
			if (loadindex===needload.length) {
				evt.target.stop();
				Net.send(ProtoType.SYNC_FINISH);
				console.log('send finish');
			}
			else{
				let msg = ProtoType.create('SyncMember');
				msg.playerid = DC.player.id;
				msg.progress = Math.floor(loadindex/needload.length*100);
				// console.log(loadindex, needload.length, loadindex/needload.length, msg.progress);
				Net.send(ProtoType.SYNC_MEMBER, msg);
			}
		};
		let timer = new egret.Timer(100);
		timer.addEventListener(egret.TimerEvent.TIMER, checkFinish, this);
		timer.start();
	}
	onMessage(evt: NetEvent){
		switch(evt.id)
		{
			case ProtoType.U_SYNC_MEMBER:
			{
				for(let i in evt.msg.playerid){
					let idx = eggtool.findIndex(this.startsync.members, (mem)=>{
						return mem.id===evt.msg.playerid[i];
					});
					if(idx<0){
						console.log('找不到玩家');
						continue;
					}
					this.m_percents[idx].text = `${evt.msg.progress[i]}%`;
				}
			}
			break;
		}
	}
}