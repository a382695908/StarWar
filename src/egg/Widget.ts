
class Widget
{
	private static viewStack = [];
	private static alertView = null;
	root: eui.UILayer = null;
	parent: eui.UILayer = null;
	constructor(view: egret.DisplayObject){
		this.root = new eui.UILayer();
		this.root.addChild(view);
		Main.inst.addChild(this.root);
		eggtool.centerInParent(view);
		this.root.x = this.root.anchorOffsetX = this.root.width/2;
		this.root.y = this.root.anchorOffsetY = this.root.height/2;
	}
	show(){
		if (Widget.viewStack.length>0) {
			this.parent = Widget.viewStack[Widget.viewStack.length-1];
			this.parent.visible = false;
		}
		Widget.viewStack.push(this.root);
	}
	single(){
		for(let v of Widget.viewStack){
			Main.inst.removeChild(v);
		}
		Widget.viewStack = [];
		this.show();
	}
	alert(){
		this.closeAlert();
		this.root.scaleX = 0.5;
		this.root.scaleY = 0.5;
		egret.Tween.get(this.root)
		.to({
			scaleX: 1.2,
			scaleY: 1.2
		}, 100)
		.to({
			scaleX: 1,
			scaleY: 1
		}, 20);
		Widget.alertView = this.root;
	}
	close(){
		if (Widget.alertView === this.root) {
			this.closeAlert();
		}
		else{
			this.closeWidget();
		}
	}
	private closeWidget(){
		let idx = Widget.viewStack.indexOf(this.root);
		if (idx<0 || idx!==Widget.viewStack.length-1) {
			console.log('error: Widget', idx);
			return;
		}
		Main.inst.removeChild( Widget.viewStack[idx] );
		Widget.viewStack.splice(idx, 1);
		this.root = null;
		if (this.parent) {
			this.parent.visible = true;
		}
	}
	private closeAlert(){
		if (!Widget.alertView)
			return;
		Main.inst.removeChild(Widget.alertView);
		Widget.alertView = null;
	}
}
