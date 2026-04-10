import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  imports: [NgFor],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Sita Sharma',
      location: 'Kathmandu',
      initials: 'SS',
      rating: 5,
      quote: 'K Chaiyo le mero online shopping experience nai badlidyo! Ekdam fast delivery ra quality products. Dami!'
    },
    {
      name: 'Rajesh Thapa',
      location: 'Pokhara',
      initials: 'RT',
      rating: 5,
      quote: 'Pahila online order garda tension hunthyo, tara K Chaiyo? ko service ekdam reliable cha. COD option pani cha!'
    },
    {
      name: 'Anita Gurung',
      location: 'Biratnagar',
      initials: 'AG',
      rating: 5,
      quote: 'Trending items Nepal mai paincha bhanne thaha thiena! Great prices ra doorstep delivery — love it!'
    }
  ];

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }
}
