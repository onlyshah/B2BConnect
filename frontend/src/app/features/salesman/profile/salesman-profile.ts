import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-profile.html',
  styleUrls: ['./salesman-profile.css']
})
export class SalesmanProfileComponent {
  profile = {
    name: 'Amit Kumar',
    employeeCode: 'SM-101',
    territory: 'Mumbai West',
    performanceScore: '92/100'
  };
}
