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
    { icon: 'fas fa-users', value: '5,000+', label: 'Waitlist Signups' },
    { icon: 'fas fa-map-pin', value: '75+', label: 'Districts Targeted' },
    { icon: 'fas fa-box', value: '100+', label: 'Products Planned' },
    { icon: 'fas fa-heart', value: '1', label: 'Big Nepali Dream' }
  ];
}
