import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-stats',
  imports: [NgFor],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  stats = [
    { value: '10,000+', label: 'Khushi Customers' },
    { value: '50+', label: 'Cities Across Nepal' },
    { value: '99.5%', label: 'Delivery Success Rate' },
    { value: '24/7', label: 'Customer Support' }
  ];
}
