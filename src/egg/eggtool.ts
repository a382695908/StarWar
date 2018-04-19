
namespace eggtool
{
	export function centerInParent(view: egret.DisplayObject)
	{
		if (view.parent) {
			view.x = view.parent.width/2-view.width/2;
			view.y = view.parent.height/2-view.height/2;
		}
		else{
			view.x = 960/2-view.width/2;
			view.y = 640/2-view.height/2;
		}
	}
	export function checkIndexValidate(lst, idx: number):boolean{
		if (idx<0 || idx>=lst.length) {
			return false;
		}
		return true;
	}
	export let seed = 0;
	export function random(){
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280.0;
	}
	export function randint(){
		let rnd = random()*Math.pow(2,52);
		return Math.floor(rnd);
	}
	export function findIndex(arr, cond){
		for(let i in arr){
			if (cond(arr[i])) {
				return i;
			}
		}
		return -1;
	}
}

