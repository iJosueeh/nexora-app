import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  scrollDown(): void {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  }
}
