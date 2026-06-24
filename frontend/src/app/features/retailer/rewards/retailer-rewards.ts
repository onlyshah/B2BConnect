import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-rewards.html',
  styleUrls: ['./retailer-rewards.css']
})
export class RetailerRewardsComponent {
  rewards = [
    { label: 'Points Earned', value: '1,240' },
    { label: 'Referral Rewards', value: '₹500' },
    { label: 'Retailer Ranking', value: 'Gold' }
  ];
}
