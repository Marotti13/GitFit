import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';




interface user {
    username: string,
    uid: string
}


@Injectable()
export class UserService {
    private user: user; 
    results:any;  
    id:any;  
    constructor(
        private firestore: AngularFirestore, 
        public afAuth: AngularFireAuth
        ){}
    
    user1 = this.afAuth.auth;


    getUID() {
        return this.user1.currentUser.uid;
    }
    create_NewWorkout(record) {
        return this.firestore.collection('Workouts').add(record);
    }
    
    //accesses Workout collection and reads documents in it
    read_Workouts() {
        return this.firestore.collection('Workouts').snapshotChanges();
    }
  
    //updates information in certain workout with record info
    update_Workout(recordID,record){
        this.firestore.doc('Workouts/' + recordID).update(record);
    }
    
    //deletes workout from database
    delete_Workout(record_id) {
        this.firestore.doc('Workouts/' + record_id).delete();
    }

    //creates favorite in user's personal collection
    create_Favorite(record, nameID){
        
        return this.firestore.collection('Users').doc(this.user1.currentUser.uid).collection('Favorites').doc(nameID).set({
            WorkoutName: record['Name'],
            WorkoutDescript: record['Descript'],
            Image: record['Image']
        });
    }

    //reads favorites from user's collection
    read_Favorites() {
        return this.firestore.collection('Users').doc(this.user1.currentUser.uid).collection('Favorites').snapshotChanges();
    }

    //updates favorite in case information has changed
    update_Favorite(recordID, record){
        this.firestore.doc('Users/' +  this.user1.currentUser.uid + 'Favorites/' + recordID).update(record);
    }

    //deletes favorite with specified id
    delete_Favorite(record_id){
        
        this.firestore.doc('Users/' + this.user1.currentUser.uid + '/Favorites/' + record_id).delete();
    }

    search_Workouts(workout_name){
        return this.firestore.collection('Workouts', ref => ref.where('Name', '==', workout_name)).snapshotChanges();
    }
    read_UserInfo(){
        return this.firestore.collection('Users').snapshotChanges();
    }

    update_Email(email){
        this.firestore.collection("Users").doc(this.user1.currentUser.uid).update({UserEmail:email});
    }

    update_Name(name){
        this.firestore.collection('Users').doc(this.user1.currentUser.uid).update({
            UserName: name
        });
    }
    update_Work(name, des, img){
        
    console.log(name);
      var sesh = this.firestore.collection("Workouts", ref => ref.where('Name', '==', name)).snapshotChanges();
      sesh.subscribe(data =>{
        this.results = data.map(e => {
          return{
            id: e.payload.doc.id,
            
          };
        })
        this.id = this.results[0].id;
      })


        if(img==="" && des!=''){
            this.firestore.collection('Workouts').doc(this.id).update({Description:des});

        }else if(img!="" && des!=""){
            this.firestore.collection('Workouts').doc(this.id).update({Description:des, Image:img});

        }else if(img!='' && des===''){
            this.firestore.collection('Workouts').doc(this.id).update({Image:img});

        }
        this.id =null;
        this.results=null;

    }
}