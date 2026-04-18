import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Trend {
  category: string;
  title: string;
  conversations: string;
}

export interface SuggestedUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-feed-trends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed-trends.html',
  styleUrl: './feed-trends.css'
})
export class FeedTrends {
  trends = signal<Trend[]>([
    {
      category: 'TENDENCIAS EN CIENCIA',
      title: '#BioEthics2024',
      conversations: '45.2K'
    },
    {
      category: 'RESEARCH',
      title: 'Hackathon ',
      conversations: '28.5K'
    },
    {
      category: 'RESEARCH',
      title: '#SustainableUrbanismo',
      conversations: '19.8K'
    }
  ]);

  suggestedUsers = signal<SuggestedUser[]>([
    {
      id: '1',
      name: 'David Okun',
      role: 'Pro Trainer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
    },
    {
      id: '2',
      name: 'Li Wei',
      role: 'Researcher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li'
    },
    {
      id: '3',
      name: 'Sarah Lopez',
      role: 'Community Lead',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    }
  ]);
}
