import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [NgFor],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  categories = [
    { icon: 'fas fa-mobile-screen', title: 'Electronics & Gadgets', description: 'Latest phones, laptops, earbuds — sabai trending tech products!', tag: 'Coming Soon' },
    { icon: 'fas fa-shirt', title: 'Fashion & Clothing', description: 'Nepali ra international brands, trending styles timro lagi curated!', tag: 'Coming Soon' },
    { icon: 'fas fa-house', title: 'Home & Kitchen', description: 'Ghar sajaunus, kitchen upgrade garus — quality products at great prices!', tag: 'Coming Soon' },
    { icon: 'fas fa-heart-pulse', title: 'Beauty & Health', description: 'Skincare, wellness, fitness essentials — aphai glow up gara!', tag: 'Coming Soon' },
    { icon: 'fas fa-book-open', title: 'Books & Stationery', description: 'Nepali ra English books, office supplies, student essentials!', tag: 'Coming Soon' },
    { icon: 'fas fa-dumbbell', title: 'Sports & Fitness', description: 'Gym gear, outdoor equipment, sports accessories — active raha!', tag: 'Coming Soon' }
  ];
}
