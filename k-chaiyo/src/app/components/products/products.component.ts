import { Component } from '@angular/core';
import { NgFor, NgClass, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [NgFor, NgClass, NgStyle, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  categories = [
    {
      icon: 'fas fa-mobile-screen',
      title: 'Electronics & Gadgets',
      description: 'Latest phones, laptops, earbuds — sabai trending tech products timro lagi!',
      tag: 'Coming Soon',
      badgeStyle: 'purple',
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED'
    },
    {
      icon: 'fas fa-shirt',
      title: 'Fashion & Clothing',
      description: 'Nepali ra international brands, trending styles — K lagaune? Hami sanga cha!',
      tag: 'Coming Soon',
      badgeStyle: 'blue',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB'
    },
    {
      icon: 'fas fa-house',
      title: 'Home & Kitchen',
      description: 'Ghar sajaunus, kitchen upgrade garus — quality products, great prices!',
      tag: 'Coming Soon',
      badgeStyle: 'cyan',
      iconBg: '#CFFAFE',
      iconColor: '#06B6D4'
    },
    {
      icon: 'fas fa-heart-pulse',
      title: 'Beauty & Health',
      description: 'Skincare, wellness, fitness essentials — K chaiyo glow up ko lagi? Sab cha!',
      tag: 'Coming Soon',
      badgeStyle: 'pink',
      iconBg: '#FCE7F3',
      iconColor: '#EC4899'
    },
    {
      icon: 'fas fa-book-open',
      title: 'Books & Stationery',
      description: 'Nepali ra English books, office supplies, student essentials — sab ekai thau!',
      tag: 'Coming Soon',
      badgeStyle: 'amber',
      iconBg: '#FEF3C7',
      iconColor: '#D97706'
    },
    {
      icon: 'fas fa-dumbbell',
      title: 'Sports & Fitness',
      description: 'Gym gear, outdoor equipment, sports accessories — active huna ready?',
      tag: 'Coming Soon',
      badgeStyle: 'green',
      iconBg: '#D1FAE5',
      iconColor: '#059669'
    }
  ];
}
