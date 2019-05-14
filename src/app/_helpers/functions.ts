import { Injectable } from '@angular/core';

@Injectable()

export class Functions {
	
	constructor() {
		// code...
	}

	titleCaseWord(word: string) {
		if (!word) return word;
		return word[0].toUpperCase() + word.substr(1).toLowerCase();
	}
}