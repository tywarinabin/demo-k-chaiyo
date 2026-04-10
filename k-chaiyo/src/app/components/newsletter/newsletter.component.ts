import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-newsletter',
  imports: [FormsModule, NgIf],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {
  email = '';
  submitted = false;

  onSubmit() {
    if (this.email) {
      this.submitted = true;
    }
  }
}
