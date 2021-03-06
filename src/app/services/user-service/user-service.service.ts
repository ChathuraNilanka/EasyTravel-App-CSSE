import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface Passenger {
  firstName: string,
  lastname: string,
  accountbalance: number,
  phoneNumber: string,
  nic: string,
  status: string,
  createdDate: string
}

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private firestore: AngularFirestore) { }


  createUser(userId, number) {
    var record = {
      accountBalance: 0,
      firstName: "",
      lastName: "",
      nic: "",
      phoneNumber: number,
      holdBalance: 0,
      status: 'inactive',
      createdDate: new Date()
    }
    return this.firestore.collection('passengers').doc(userId).set(record).then(e => {
      console.log("Document successfully written!" + e);
    });
  }

  checkUser(userId) {
    return this.firestore.collection('passengers').doc(userId);
  }

  updateUser(userId, userObj) {
    return this.firestore.collection('passengers').doc(userId).update(userObj);
  }

  rechargeAccount(userId, user) {
    return this.firestore.collection('passengers').doc(userId).update(user);
  }

  addPayment(payment) {
    return this.firestore.collection('payments').add(payment);
  }

  getPayments(userId) {
    return this.firestore.collection('payments', ref => ref.where('passenger', '==', userId)).valueChanges();
  }

}