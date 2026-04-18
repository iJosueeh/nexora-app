import { AuthUser } from '../../../interfaces/auth';

export type ProfileTab = 'posts' | 'media' | 'likes';

export interface ProfileCard {
  title: string;
  label: string;
  imageUrl?: string;
  badge: string;
  description: string;
  variant: 'image' | 'text' | 'link';
  likes?: string;
  comments?: string;
  cta?: string;
}

export interface ProfileViewModel extends AuthUser {
  email: string;
  displayName: string;
  handle: string;
  bio: string;
  career: string;
  avatarUrl: string;
  bannerUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  joinedLabel: string;
  featuredInterests: string[];
  profileComplete?: boolean;
}

export function buildProfileViewModel(user: AuthUser | null | undefined): ProfileViewModel {
  const email = user?.email ?? 'usuario@nexora.app';
  const baseName = user?.fullName?.trim() || user?.username?.trim() || email.split('@')[0] || 'Usuario Nexora';
  const handle = `@${(user?.username?.trim() || email.split('@')[0] || 'nexora').toLowerCase()}`;

  return {
    ...(user ?? { email }),
    email,
    displayName: baseName,
    handle,
    bio: user?.bio?.trim() || 'Estudiante de último año con foco en IA, diseño de interfaces y sistemas académicos.',
    career: user?.career?.trim() || 'Ingeniería de Software',
    avatarUrl: user?.avatarUrl?.trim() || buildAvatarUrl(handle),
    bannerUrl: user?.bannerUrl?.trim() || buildBannerUrl(handle),
    followersCount: user?.followersCount ?? 1240,
    followingCount: 842,
    postsCount: 156,
    joinedLabel: 'Se unió recientemente',
    featuredInterests: (user?.academicInterests ?? []).slice(0, 4).length > 0
      ? (user?.academicInterests ?? []).slice(0, 4)
      : ['Machine Learning', 'UI Design', 'Neural Networks', 'Logic'],
  };
}

export function buildProfilePosts(name: string): ProfileCard[] {
  return [
    {
      title: 'Finals week survival kit: Caffeine and clean code.',
      label: 'Academic Life',
      imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=900&h=700&fit=crop',
      badge: '2 hours ago',
      description: `${name} compartió su rutina para sobrevivir la semana de exámenes sin perder foco.`,
      variant: 'image',
      likes: '245',
      comments: '12',
    },
    {
      title: 'The more I learn about Large Language Models, the more I appreciate the sheer complexity of human intuition.',
      label: 'Thought',
      badge: 'Yesterday',
      description: 'Reflexión sobre investigación, producto y cómo el criterio humano sigue importando en la práctica diaria.',
      variant: 'text',
      likes: '1.1k',
      comments: '84',
    },
    {
      title: 'Walking through the Old Wing never fails to inspire deep focus.',
      label: 'Moments',
      imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&h=700&fit=crop',
      badge: '3 days ago',
      description: 'Un vistazo al entorno académico que acompaña el trabajo y la concentración diaria.',
      variant: 'image',
      likes: '89',
      comments: '3',
    },
    {
      title: 'Optimizing React Hooks for Performance',
      label: 'Link Shared',
      badge: 'Read article',
      description: 'A deep dive into why your renders are slow and how to fix them. Essential for the upcoming CS302 project.',
      variant: 'link',
      cta: 'Read article',
    },
  ];
}

export function buildAvatarUrl(seed = 'nexora'): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

export function buildBannerUrl(seed = 'nexora'): string {
  const encoded = encodeURIComponent(seed.replace(/[^a-z0-9]/gi, ''));
  return `https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=500&fit=crop&crop=entropy&seed=${encoded}`;
}

export function formatCompact(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
  }

  return value.toString();
}
