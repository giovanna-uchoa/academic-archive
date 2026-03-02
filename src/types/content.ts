export interface Subject {
  id: string;
  title: string;
  description: string;
  overview: string;
  icon: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  timeSpent: string;
  subjectId: string;
}
