import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-timeline',
  imports: [NgFor],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  steps = [
    {
      number: 1,
      icon: '🔍',
      title: 'Browse & Discover',
      description: 'Trending items hera, categories explore gara, ani mann pareko item pick gara!'
    },
    {
      number: 2,
      icon: '🛒',
      title: 'Add to Cart',
      description: 'Cart ma haal, quantity set gara — jhyap, that\'s it!'
    },
    {
      number: 3,
      icon: '💳',
      title: 'Place Your Order',
      description: 'eSewa, Khalti, ya COD — timro convenience, timro choice!'
    },
    {
      number: 4,
      icon: '📦',
      title: 'Delivered to You!',
      description: 'Gharmai aaucha! Sit back, relax, and wait for the doorbell. Dami, haina?'
    }
  ];
}
