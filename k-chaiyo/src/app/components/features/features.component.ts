import { Component } from '@angular/core';
import { NgFor, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-features',
  imports: [NgFor, NgClass, NgStyle],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  features = [
    {
      icon: 'fas fa-wand-magic-sparkles',
      title: 'Trending Items',
      description: 'Sabai bhanda naya ra trending items haru curate garinecha — K popular cha? Hami dekhauchhau!',
      badge: 'Coming Soon',
      accent: 'purple',
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED'
    },
    {
      icon: 'fas fa-truck',
      title: 'Doorstep Delivery',
      description: 'Nepal bhari gharmai delivery — Kathmandu, Pokhara, Biratnagar, jaha chau tyahai!',
      badge: 'Launching Soon',
      accent: 'blue',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB'
    },
    {
      icon: 'fas fa-mobile-screen',
      title: 'Easy Ordering',
      description: 'Jhyap! Seconds mai order. No hassle, no confusion. Kati sajilo? Timle nai try gara!',
      badge: 'Almost Ready',
      accent: 'cyan',
      iconBg: '#CFFAFE',
      iconColor: '#06B6D4'
    },
    {
      icon: 'fas fa-shield-halved',
      title: 'Secure Payments',
      description: 'eSewa, Khalti, bank transfer — timro tarikale pay gara, paisa safe cha!',
      badge: 'In Progress',
      accent: 'green',
      iconBg: '#D1FAE5',
      iconColor: '#059669'
    }
  ];
}
