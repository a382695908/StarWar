class State
{
	private state: string[] = [];
	public onchange = [];
	add(s){
		// for(let x of s.split('.')){
		// 	if (this.state.indexOf(x)>=0)
		// 		continue;
		// 	this.state.push(x);
		// }
		this.state.push(s);
		checkNotify(this.onchange, this);
	}
	set(s){
		this.state = [];
		this.add(s);
	}
	rm(s){
		if (this.state.indexOf(s)<0)
			return;
		this.state.splice(this.state.indexOf(s), 1);
		checkNotify(this.onchange, this);
	}
	rmall(s){
		while(this.state.indexOf(s)>=0){
			this.state.splice(this.state.indexOf(s), 1);
		}
		checkNotify(this.onchange, this);
	}
	has(s){
		return this.state.indexOf(s)>=0;
	}
	is(s){
		return this.state.length===1 && this.state[0]===s;
	}
	empty(){
		return this.state.length===0;
	}
	clear(){
		// if (this.state.length===0) {
		// 	return;
		// }
		this.state = [];
		checkNotify(this.onchange, this);
	}
	toString(){
		return this.state.join(',');
	}
}