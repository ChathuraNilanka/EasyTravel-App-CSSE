import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.page.html',
  styleUrls: ['./navigation-menu.page.scss'],
})
export class NavigationMenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'Routes',
      url: '/menu/routes',
      icon: 'navigate'
    },
    {
      title: 'My Rides',
      url: '/menu/history',
      icon: 'swap'
    },
    {
      title: 'Recharge',
      url: '/menu/recharge',
      icon: 'card'
    },
    {
      title: 'Settings',
      url: '/menu/settings',
      icon: 'cog'
    },
    {
      title: 'Log Out',
      url: '/login',
      icon: 'exit'
    }
  ];

  selectedPath = '';
  userAccount: any;
  accBalance: number;
  lname: any;
  fname: any;
  userId: any;
  phoneNumber: any;

  constructor(private router: Router, private storage: Storage, private firestore: AngularFirestore) {

    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });

    var userAcc = {
      userId: 'XpLThkfoeYcPTquTA2RIcoCLuO12',
    }

    storage.set('user', userAcc);

    this.storage.get('user').then((val) => {
      this.userId = val.userId;
      this.firestore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(_user => {
          this.userAccount = _user;
          console.log(this.userAccount);
          this.fname = this.userAccount.firstName;
          this.lname = this.userAccount.lastName;
          this.accBalance = this.userAccount.accountBalance;
          this.phoneNumber = this.userAccount.phoneNumber;
        });
    });

  }

  ngOnInit() {
  }

}