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
    this.suggestionsList.push(new Suggestion('Item 1', 1));
    this.suggestionsList.push(new Suggestion('Item 2', 4));
    this.suggestionsList.push(new Suggestion('Item 3', 1));
    this.suggestionsList.push(new Suggestion('Item 4'));
  }

}
