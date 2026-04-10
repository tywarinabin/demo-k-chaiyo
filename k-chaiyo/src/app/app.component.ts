import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { StatsComponent } from './components/stats/stats.component';
import { CtaComponent } from './components/cta/cta.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    TimelineComponent,
    TestimonialsComponent,
    StatsComponent,
    CtaComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'K Chaiyo?';
}
