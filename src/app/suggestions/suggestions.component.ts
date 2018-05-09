import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { AngularFireDatabase , } from 'angularfire2/database';
import { AuthService } from '../core/auth.service';
import { Observable } from '@firebase/util';
import 'rxjs/add/operator/map';

interface  Suggestion {
  title: string;
  likes: number;
  likedBy: string[];
  liked: boolean;
}
interface SuggestionId extends Suggestion {
  id: string;
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
    this.auth.user.subscribe(user=>{this.user = user.uid});

    this.suggestionsCol = this.afs.collection('suggestions', ref => ref.orderBy('timestamp'));
    this.suggestionsList = this.suggestionsCol.snapshotChanges()
      .map(res => {
        return res.map( suggestion => {
          let data = suggestion.payload.doc.data() as Suggestion;
          data.liked = data.likedBy.indexOf(this.user) !== -1? true : false;
          const id = suggestion.payload.doc.id;
          return { id, data };  
        });
      });
  }

  addSuggestion() {
    if (this.newSuggestion) {
      this.afs.collection('suggestions').add({ 'title': this.newSuggestion, 'likes': 0, 'timestamp': new Date(), 'likedBy': [] });
    }
  }

  //Add or remove like depending on the state
  toggleLike(suggestion) {
    if (!suggestion.data.liked) {
      this.incrementLike(suggestion.id);
    }
    else {
      this.decrementLike(suggestion.id);
    }
  }

  incrementLike(id) {
    const sgDocRef = this.afs.firestore.collection("suggestions").doc(id);
    this.afs.firestore.runTransaction(transaction => 
      // This code may get re-run multiple times if there are conflicts.
        transaction.get(sgDocRef)
        .then(sgDoc => {
          let likedBy = sgDoc.data().likedBy;
          if (!likedBy) {
            likedBy = [];
          }
          if (likedBy.indexOf(this.user) === -1) {
            likedBy.push(this.user);
            transaction.update(sgDocRef, { likes: sgDoc.data().likes + 1, likedBy: likedBy });
          } else {
            transaction.update(sgDocRef, { likes: sgDoc.data().likes, likedBy: likedBy });
          }
        }));
  }
  
  decrementLike(id) {
    const sgDocRef = this.afs.firestore.collection("suggestions").doc(id);
    this.afs.firestore.runTransaction(transaction => 
      // This code may get re-run multiple times if there are conflicts.
        transaction.get(sgDocRef)
        .then(sgDoc => {
          let likedBy = sgDoc.data().likedBy;
          if (likedBy) {
            let index = likedBy.indexOf(this.user);
            if (index !== -1) {
              likedBy.splice(index, 1);
              transaction.update(sgDocRef, { likes: sgDoc.data().likes - 1, likedBy: likedBy });
            } else {
              transaction.update(sgDocRef, { likes: sgDoc.data().likes, likedBy: likedBy });
            }
          }
        }));
  }
}
