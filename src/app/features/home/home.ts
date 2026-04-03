import { Component } from '@angular/core';
import { Navbar } from "../../shared/components/navbar/navbar";
import { Hero } from "./hero/hero";
import { Collaboration } from "./collaboration/collaboration";
import { Stats } from "./stats/stats";
import { Testimonials } from "./testimonials/testimonials";
import { Pulse } from "./pulse/pulse";
import { CtaBanner } from "./cta-banner/cta-banner";
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-home',
  imports: [Navbar, Hero, Collaboration, Stats, Testimonials, Pulse, CtaBanner, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
