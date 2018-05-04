import { Component } from '@angular/core';
import { Suggestion } from '../suggestion';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent {

  suggestionsList = [];
  
  constructor() {
    this.suggestionsList.push(new Suggestion(1, 'Item 1', 1));
    this.suggestionsList.push(new Suggestion(2, 'Item 2', 4));
    this.suggestionsList.push(new Suggestion(3, 'Item 3', 1));
    this.suggestionsList.push(new Suggestion(4, 'Item 4'));
  }

  addSuggestion(title: string) {
    if (title) {
      this.suggestionsList.push(new Suggestion(this.suggestionsList.length, title));
    }
  }

  //Add or remove like depending on the state
  toggleLike(index) {
    let suggestion = this.suggestionsList[index];
    if (!suggestion.liked) {
      suggestion.addLike();
    }
    else {
      suggestion.removeLike();
    }
  }
}
