import { Component } from '@angular/core';
import { Collaboration } from './collaboration/collaboration';
import { CtaBanner } from './cta-banner/cta-banner';
import { Hero } from './hero/hero';
import { Pulse } from './pulse/pulse';
import { Stats } from './stats/stats';
import { Testimonials } from './testimonials/testimonials';

@Component({
  selector: 'app-home',
  imports: [Hero, Collaboration, Stats, Testimonials, Pulse, CtaBanner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
