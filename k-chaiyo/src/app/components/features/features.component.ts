import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-features',
  imports: [NgFor],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  features = [
    {
      icon: '✨',
      title: 'Trending Items',
      description: 'Sabai bhanda naya ra trending items, curated just for you. Stay ahead of the game!'
    },
    {
      icon: '🚚',
      title: 'Doorstep Delivery',
      description: 'Gharmai delivery across Nepal — Kathmandu, Pokhara, Biratnagar, wherever you are!'
    },
    {
      icon: '📱',
      title: 'Easy Ordering',
      description: 'Jhyap! Order in seconds. No hassle, no confusion. Ekdam sajilo process.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'eSewa, Khalti, bank transfer — pay your way, paisa safe!'
    }
  ];
}
