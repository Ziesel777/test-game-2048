import 'velocity-animate';
import 'velocity-animate/velocity.ui';

export default class Tile {
	constructor(x,y,type,game){
		this.x=x;
		this.y=y;
		this.type = type;
		this.game = game;
		this.target = null;

		this.create();
	}

	create(){
		let x = this.x;
		let y = this.y;
		let type = this.type;
		let game = this.game;

		this.target = $('<div>', {
			'class': `thing t${type}`,
			style:`top: ${100*y}px; left: ${100*x}px;`,
		});

		game.target.append(this.target);

		this.target.velocity("transition.fadeIn", { display: "flex" }, { duration: 300, queue: false });
	}

	dbSetAnim(){
		// this.target
		// 	.velocity('transition.bounceIn',{ display: "flex" },{ duration: 300, queue: false});
	}

	destroy(){
		this.target.remove();
	}

	setType(){
		this.target
			.removeClass(`t${this.type/2}`)
			.addClass(`t${this.type}`);
	}

	setPosRow(x){
		let tile = this;
		let game = this.game;
		let deltaX = x-this.x;

		game.checkMove=true;
		if(deltaX!=0){
			this.target.velocity({ left: `${100*x}px`}, {
				complete: function(elem) {
					game.checkMove=false;
					tile.x = x;
				}
			}, { duration: 400, queue: false});
		}
	}

	setPosCol(y){
		let tile = this;
		let game = this.game;
		let deltaY = y-this.y;

		game.checkMove=true;
		if(deltaY!=0){
			this.target.velocity({ top: `${100*y}px`}, {
				complete: function(elem) {
					game.checkMove=false;
					tile.y = y;
				}
			}, { duration: 400, queue: false });
		}
	}
}