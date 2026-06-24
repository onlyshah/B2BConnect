import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-offers.html',
  styleUrls: ['./retailer-offers.css']
})
export class RetailerOffersComponent {
  offers = [
    { title: 'Festival Pack', detail: 'Flat 10% off on bulk orders', valid: 'Till July 31' },
    { title: 'Loyalty Reward', detail: 'Extra points on every order', valid: 'Ongoing' }
  ];
}
