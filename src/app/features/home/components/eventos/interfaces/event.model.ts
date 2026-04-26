export interface UniversityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Debate' | 'Taller' | 'Feria' | 'Conferencia';
  attendees: number;
  image?: string;
}
