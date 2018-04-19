class Toast
{
	constructor(text: string){
		// console.log(text);
        let lab = new egret.TextField();
        Main.inst.addChild(lab);
        lab.text = text;
        lab.textAlign = egret.HorizontalAlign.CENTER;
        lab.textColor = 0xffff00;
        lab.width = lab.stage.width;
        lab.anchorOffsetY = lab.height;
        lab.y = lab.height/2;
        let tw = egret.Tween.get(lab);
        tw.to({ "y": lab.height*1.5 }, 500);
        tw.wait(2000);
        tw.call(()=>{
            Main.inst.removeChild(lab);
        }, this);
	}
}