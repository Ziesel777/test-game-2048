import Tile from './game-object/tile';
import Data from './game-logic/data';

import 'velocity-animate';
import 'velocity-animate/velocity.ui';

export default class Game {
	constructor(){
		this.data = new Data(this);

		this.target = $('#playfield');
		this.modals = $('.js-info-modals');

		this.checkMove = false;
		this.score = 0;

		this.init();
	}

	init() {
		this.createRndTile();
		this.keyControl();
		this.mouseControl();
	}

	createRndTile(){
		let type = (Math.random()*10 <= 1)? 4: 2;
		let listEmpty = this.data.isNullCell();

		if(listEmpty){
			let rndIndex = Math.floor(Math.random() * Math.floor(listEmpty.length));
			let cell = this.data.isNullCell()[rndIndex];
			let tile = new Tile(cell.x, cell.y, type, this);

			this.data.addTile(tile);
		} else {
			this.gameover();
		}
	}

	move(type){
		this.checkMove = true;


		this.data.shift(type);
		this.updateField();

		this.delay(500,()=>{
			this.findDbCell(type);
			this.updateField();
			this.data.shift(type);
			this.updateField();
		});
		this.delay(600,()=>{
			this.createRndTile();
			this.checkMove = false;
			$('.js-score').text(this.score);
		});
	}

	updateField() {
		let field = this.data.field;
		for(let y=0; y<4; y++){
			for(let x=0; x<4; x++){
				if(field[y][x]!=null){
					let tile = field[y][x];

					if(tile.x != x){
						tile.setPosRow(x);
					}
					if(tile.y != y){
						tile.setPosCol(y);
					}
				}
			}
		}
	}

	findDbCell(type) {
		let field = this.data.field;
		let count = 0;

		switch (type) {
			case 'LEFT':{
				for(let i=0; i<4; i++){
					for(let j=0; j<3; j++){
						let cellA = field[i][j];
						let cellB = field[i][j+1];
						// debugger;
						if(cellA!=null && cellB!=null && cellA.type==cellB.type){
							cellA.type += cellB.type;
							cellA.setType();

							cellA.dbSetAnim();

							cellB.destroy();
							field[i][j+1] = null;

							this.score += cellA.type;
							count++;
						}
					}
				}
			}
				break;

			case 'RIGHT':{
				for(let i=0; i<4; i++){
					for(let j=0; j<3; j++){
						let cellB = field[i][j];
						let cellA = field[i][j+1];
						// debugger;
						if(cellA!=null && cellB!=null && cellA.type==cellB.type){
							cellA.type += cellB.type;
							cellA.setType();

							cellA.dbSetAnim();

							cellB.destroy();
							field[i][j] = null;

							this.score += cellA.type;
							count++;
						}
					}
				}
			}
				break;

			case 'UP':{
				this.data.transField();

				for(let i=0; i<4; i++){
					for(let j=0; j<3; j++){
						let cellA = field[i][j];
						let cellB = field[i][j+1];
						// debugger;
						if(cellA!=null && cellB!=null && cellA.type==cellB.type){
							cellA.type += cellB.type;
							cellA.setType();

							cellA.dbSetAnim();

							cellB.destroy();
							field[i][j+1] = null;

							this.score += cellA.type;
							count++;
						}
					}
				}

				this.data.transField();
			}
				break;

			case 'DOWN':{
				this.data.transField();

				for(let i=0; i<4; i++){
					for(let j=0; j<3; j++){
						let cellB = field[i][j];
						let cellA = field[i][j+1];
						// debugger;
						if(cellA!=null && cellB!=null && cellA.type==cellB.type){
							cellA.type += cellB.type;
							cellA.setType();

							cellA.dbSetAnim();

							cellB.destroy();
							field[i][j] = null;

							this.score += cellA.type;
							count++;
						}
					}
				}

				this.data.transField();
			}
				break;
		}

		if(count>0) {
			// this.data.shift(type);
			// this.updateField();
			// console.log(this.score);
		}
	}

	keyControl() {
		let game = this;

		$(document).keyup(function (event) {
			event.preventDefault();
			// console.log(event.which);

			if(!game.checkMove){
				switch (event.which) {
					// left
					case 37:
						game.move('LEFT');
						break;

					// up
					case 38:
						game.move('UP');
						break;

					// right
					case 39:
						game.move('RIGHT');
						break;

					// down
					case 40:
						game.move('DOWN');
						break;

					// t - transform
					case 84:
						// this.data.transField();

						// game.data.shift('LEFT');
						// game.updateField();
						// console.log(game.data.field);
						game.gameover();
						break;
				}
			}
		});
	}

	mouseControl() {
		let game = this;
		let mousedown = false;

		let x1 = 0,
			y1 = 0,
			x2 = 0,
			y2 = 0,
			dX = 0,
			dY = 0;

		let type = null;

		this.target.unbind('mousedown').mousedown(function (e) {
			mousedown = true;
			// console.log(e);

			if(mousedown) {
				x1 = e.pageX;
				y1 = e.pageY;
			}
		});

		this.target.unbind('mouseup').mouseup(function (e) {
			if(!game.checkMove){
				if(mousedown) {
					x2 = e.pageX;
					y2 = e.pageY;

					dX = x2 - x1;
					dY = y2 - y1;

					if(Math.abs(dX)>Math.abs(dY)){
						if(dX>50) type = 'RIGHT';
						if(dX<-50) type = 'LEFT';
					} else {
						if(dY>50) type = 'DOWN';
						if(dY<-50) type = 'UP';
					}
				}

				if(type!=null){
					game.move(type);
				}

				mousedown = false;
				dX=dY=x1=x2=y1=y2=0;
				type = null;
			}
		});
	}

	gameover() {
		console.log('game over');

		let $gameover = this.modals.find('.js-game-over');
		let $info_score = this.modals.find('.js-info-score');
		let $restart = this.modals.find('.js-btn-restart');


		this.modals.velocity('transition.fadeIn', { display: "flex" }, { duration: 300 });
		$gameover.velocity('transition.flipXIn', { display: "flex" }, { duration: 300 });
		$info_score.text(`Your score: ${ this.score }`);

		$restart.click(()=>{
			this.restart();
		})
	}

	restart() {
		window.location.reload();
	}

	delay(timeout,callback){
		setTimeout(() => {
			callback();
		}, timeout);
	}
}