import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProductsComponent } from './components/products/products.component';
import { FeaturesComponent } from './components/features/features.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { StatsComponent } from './components/stats/stats.component';
import { CtaComponent } from './components/cta/cta.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    ProductsComponent,
    FeaturesComponent,
    TimelineComponent,
    CountdownComponent,
    TestimonialsComponent,
    StatsComponent,
    CtaComponent,
    FooterComponent,
    ContactModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'K Chaiyo?';
}
