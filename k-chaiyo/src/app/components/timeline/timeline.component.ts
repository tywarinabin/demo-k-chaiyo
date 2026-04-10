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
      icon: 'fas fa-search',
      title: 'Browse & Discover',
      description: 'Trending items hernu hos, categories explore garnu hos, ani mann pareko item pick garnu hos!'
    },
    {
      number: 2,
      icon: 'fas fa-cart-shopping',
      title: 'Add to Cart',
      description: 'Cart ma haalnu hos, quantity set garnu hos — jhyap, that\'s it!'
    },
    {
      number: 3,
      icon: 'fas fa-credit-card',
      title: 'Place Your Order',
      description: 'eSewa, Khalti, ya COD — timro convenience, timro choice hunecha!'
    },
    {
      number: 4,
      icon: 'fas fa-box-open',
      title: 'Delivered to You!',
      description: 'Gharmai aauchha! Sit back, relax, and wait for the doorbell. Dami hunecha, haina?'
    }
  ];
}
