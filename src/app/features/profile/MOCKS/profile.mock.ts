export interface ProfileData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  faculty: string;
  career: string;
  joinDate: string;
  stats: {
    followers: string;
    following: string;
    posts: string;
  };
  focus: string[];
}

export const PROFILE_MOCK: ProfileData = {
  id: 'user-123',
  name: 'Julian Thorne',
  handle: 'j.thorne_utp',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
  cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
  bio: 'Estudiante de último año de Informática | Apasionado de la investigación en IA y el desarrollo de interfaces centradas en el usuario.',
  faculty: 'Facultad de Ingeniería',
  career: 'Ingeniería de Software',
  joinDate: 'Se unió en octubre de 2021',
  stats: {
    followers: '1.2k',
    following: '842',
    posts: '128'
  },
  focus: ['Machine Learning', 'UI Design', 'Neural Networks', 'Logic']
};

export interface ProfilePost {
  id: string;
  type: 'image' | 'text' | 'link';
  tag: string;
  timestamp: string;
  title: string;
  content?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export const PROFILE_POSTS_MOCK: ProfilePost[] = [
  {
    id: '1',
    type: 'image',
    tag: 'ACADEMIC LIFE',
    timestamp: '2 HOURS AGO',
    title: 'Final project presentation prep in the library',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
    likes: 42,
    comments: 12
  },
  {
    id: '2',
    type: 'text',
    tag: 'THOUGHT',
    timestamp: '5 HOURS AGO',
    title: 'The future of AI in education is not about replacing teachers, but empowering students with personalized learning tools.',
    likes: 85,
    comments: 24
  },
  {
    id: '3',
    type: 'link',
    tag: 'LINK SHARED',
    timestamp: '1 DAY AGO',
    title: 'New research paper on Neural Networks published!',
    content: 'Check out my latest findings on how neural networks can be optimized for mobile devices without losing accuracy.',
    likes: 120,
    comments: 38
  },
  {
    id: '4',
    type: 'image',
    tag: 'CAMPUS',
    timestamp: '2 DAYS AGO',
    title: 'Beautiful sunset from the tech building',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    likes: 156,
    comments: 8
  }
];
