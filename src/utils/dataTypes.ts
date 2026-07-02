export interface Subject {
  id: string;
  title: string;
  description: string;
  overview: string;
  icon?: string | null;
  blogEnabled: boolean;
  blogSectionTitle: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  timeSpent: string;
  subjectId: string;
  tags: string[];
}

export interface Tag {
  name: string;
  slug: string;
}

export interface CategorySummary {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  totalPosts: number;
}

export interface TagSummary {
  slug: string;
  label: string;
  totalPosts: number;
}

export interface ArchiveGroup {
  year: number;
  month: number;
  label: string;
  posts: Post[];
}