import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { RideService } from '../services/ride.service/ride.service';
import { RideDetailsModalPage } from '../modals/ride-details-modal/ride-details-modal.page';
import { UserServiceService } from '../services/user-service/user-service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-upcoming-rides',
  templateUrl: './upcoming-rides.page.html',
  styleUrls: ['./upcoming-rides.page.scss'],
})
export class UpcomingRidesPage implements OnInit {

  user: any;
  userId: any;
  accountBalance: number = 0;
  ticketAmount: number = 0;

  rides = null;
  status: string;
  bus: any;
  regNo: any;

  constructor(private toastController: ToastController, private rideService: RideService, private alertController: AlertController,
    private modalController: ModalController, private fireStore: AngularFirestore, public firebaseAuthentication: FirebaseAuthentication,
    private userService: UserServiceService, public navCtrl: NavController) {

    this.firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      this.userId = user.uid;
      this.fireStore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(user => {
          this.user = user;
          this.accountBalance = +this.user.accountBalance;
          this.getRides(this.userId);
        });
    });

  }

  ngOnInit() {

    // this.presentToast();
  }

  async getRides(userId) {
    await this.rideService.getRides(userId).subscribe(ride => {
      this.rides = null;
      ride.forEach(element => {
        if (element.status == 'upcoming' || element.status == 'ongoing') {
          this.rides = ride;
        }

        if (element.status == 'ongoing') {
          this.rideService.getBus(element.bus).subscribe(bus => {
            this.bus = bus;
            this.regNo = this.bus.regNo.toUpperCase();
          })
        }

      });
    });
  }



  async viewRide(ride) {
    console.log(ride.id)
    this.navCtrl.navigateForward(['qr'], {
      queryParams: {
        data: ride.id,
        status: true
      }
    });
    // const modal = await this.modalController.create({
    //   component: RideDetailsModalPage,
    //   componentProps: {
    //     'ride': ride,
    //     'docId': ride.id
    //   }
    // });
    // return await modal.present();
  }0

  async cancelRide(ride) {
    const header = 'Cancel ride';
    const message = 'Do you really want to cancel the ride?';
    this.ticketAmount = +ride.ticketAmount;
    this.showCancelAlert(ride, header, message)
  }

  updateRide(ride) {
    ride.status = 'cancelled';
    this.rideService.cancelRide(ride).then(() => { });
  }

  updateUser(user) {
    user.accountBalance = this.accountBalance + this.ticketAmount;
    console.log(user.accountBalance)
    this.userService.updateUser(this.userId, user).then(() => { });
  }

  async showCancelAlert(ride, header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'danger',
          handler: (exit) => {

          }
        }, {
          text: 'Yes',
          handler: () => {
            this.updateRide(ride);
            this.updateUser(this.user);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast() {

    const toast = await this.toastController.create({
      message: 'Slide Left to edit ride details',
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

}
