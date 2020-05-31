export default class Data {
	constructor(game) {
		this.game = game;
		this.field = null;

		this.create();
	}

	create() {
		this.field = [];
		for (let y = 0; y < 4; y++) {
			this.field.push([]);

			for (let x = 0; x < 4; x++) {
				this.field[y].push(null);
			}
		}
	}

	addTile(tile) {
		this.field[tile.y][tile.x] = tile;
	}

	transField() {
		let field = this.field;

		for (let i = 0; i<4; i++) {
			for (let j = 0; j<i; j++) {
				[field[i][j], field[j][i]] = [field[j][i], field[i][j]];
			}
		}
	}

	shift(type){
		let field = this.field;
		let count = 0;

		switch (type) {
			case 'LEFT':{
				for(let y=0; y<4; y++){
					let x=0;
					while(count<4){
						if(field[y][x]==null){
							field[y].splice(x,1);
							field[y].push(null);
						} else {
							x++;
						}
						count++;
					}
					count = 0;
				}
			}
				break;

			case 'RIGHT':{
				for(let y=0; y<4; y++){
					let x=3;
					while(count<4){
						if(field[y][x]==null){
							field[y].splice(x,1);
							field[y].unshift(null);
						} else {
							x--;
						}
						count++;
					}
					count = 0;
				}
			}
				break;

			case 'UP':{
				this.transField();
				for(let y=0; y<4; y++){
					let x=0;
					while(count<4){
						if(field[y][x]==null){
							field[y].splice(x,1);
							field[y].push(null);
						} else {
							x++;
						}
						count++;
					}
					count = 0;
				}
				this.transField();
			}
				break;

			case 'DOWN':{
				this.transField();
				for(let y=0; y<4; y++){
					let x=3;
					while(count<4){
						if(field[y][x]==null){
							field[y].splice(x,1);
							field[y].unshift(null);
						} else {
							x--;
						}
						count++;
					}
					count = 0;
				}
				this.transField();
			}
				break;
		}
	}

	isNullCell(){
		let emptyListCells = [];
		for (let i = 0; i<4; i++) {
			for (let j = 0; j<4; j++) {
				if(this.field[i][j]==null){
					emptyListCells.push({x:j,y:i});
				}
			}
		}
		if(emptyListCells.length>0){
			return emptyListCells;
		}
		return false;
	}
}