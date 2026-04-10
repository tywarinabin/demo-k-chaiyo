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
      icon: 'fas fa-wand-magic-sparkles',
      title: 'Trending Items',
      description: 'Sabai bhanda naya ra trending items haru curate garinecha — timro lagi specially! Stay ahead of the game.'
    },
    {
      icon: 'fas fa-truck',
      title: 'Doorstep Delivery',
      description: 'Nepal bhari gharmai delivery — Kathmandu, Pokhara, Biratnagar, jaha chau tyahai!'
    },
    {
      icon: 'fas fa-mobile-screen',
      title: 'Easy Ordering',
      description: 'Jhyap! Seconds mai order. No hassle, no confusion. Ekdam sajilo process hunecha.'
    },
    {
      icon: 'fas fa-shield-halved',
      title: 'Secure Payments',
      description: 'eSewa, Khalti, bank transfer — timro tarikale pay gara, paisa ekdam safe hunecha!'
    }
  ];
}
