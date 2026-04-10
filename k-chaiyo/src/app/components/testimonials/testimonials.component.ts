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
      quote: 'K Chaiyo? ko concept ekdam ramro cha! Nepal lai yesto platform chaieko thyo. Waitlist join garisakey — launch huna sakdina!'
    },
    {
      name: 'Rajesh Thapa',
      location: 'Pokhara',
      initials: 'RT',
      rating: 5,
      quote: 'Early demo dekhepaxi ta jhyap bhayo! UI ekdam clean cha, ordering process sajilo cha. Can\'t wait for the full launch!'
    },
    {
      name: 'Anita Gurung',
      location: 'Biratnagar',
      initials: 'AG',
      rating: 5,
      quote: 'Finally Nepal mai international-level delivery platform aaudai cha! Prices pani reasonable dekhiyo. Excited for April 2027!'
    },
    {
      name: 'Bikash Adhikari',
      location: 'Chitwan',
      initials: 'BA',
      rating: 5,
      quote: 'Nepal mai yesto platform chaieko thyo! International quality products local price ma — K Chaiyo? le Nepal ko e-commerce nai change garcha!'
    },
    {
      name: 'Priya Maharjan',
      location: 'Lalitpur',
      initials: 'PM',
      rating: 5,
      quote: 'Demo version try gareko, UI ekdam smooth cha! Ordering process 2 minute mai sakiyo. Pahila yesto experience Nepal mai paako thiyena.'
    },
    {
      name: 'Sunil Rai',
      location: 'Dharan',
      initials: 'SR',
      rating: 5,
      quote: 'Eastern Nepal samma delivery aaucha bhanne sunera khushi lagyo! Finally haami pani online shopping enjoy garna paauchau. Waiting for the launch!'
    }
  ];

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }
}
