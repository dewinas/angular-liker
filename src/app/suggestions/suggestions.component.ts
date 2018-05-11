import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { AngularFireDatabase , } from 'angularfire2/database';
import { AuthService } from '../core/auth.service';
import { Observable } from '@firebase/util';
import 'rxjs/add/operator/map';

interface  Suggestion {
  title: string;
  likedBy: string[];
}
@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',  
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent {

  suggestionsCol: AngularFirestoreCollection<Suggestion>;
  suggestionsList: any;
  newSuggestion: string;

  user: string;
  
  constructor(public auth: AuthService, private afs: AngularFirestore) {
    afs.firestore.settings({ timestampsInSnapshots: true });
  }

  ngOnInit() {
    this.auth.user.subscribe(user=>{
      if (user) {
        this.user = user.uid
      }
    });

    this.suggestionsCol = this.afs.collection('suggestions', ref => ref.orderBy('timestamp'));
    this.suggestionsList = this.suggestionsCol.snapshotChanges()
      .map(res => {
        return res.map( suggestion => {
          let data = suggestion.payload.doc.data() as Suggestion;
          const id = suggestion.payload.doc.id;
          return { id, data };  
        });
      });
      console.log(this.suggestionsList);
  }

  addSuggestion() {
    if(this.newSuggestion) {
      this.afs.collection('suggestions').add({ 'title': this.newSuggestion, 'timestamp': new Date(), 'likedBy': [] });
      this.newSuggestion = '';
    }
  }

  toggleLike(suggestion) {
    let index = suggestion.data.likedBy.indexOf(this.user);
    const sgDocRef = this.afs.firestore.collection("suggestions").doc(suggestion.id);
    if (index == -1) {
      suggestion.data.likedBy.push(this.user);
    }
    else {
      suggestion.data.likedBy.splice(index, 1);
    } 
    sgDocRef.update(suggestion.data);
  }

}
