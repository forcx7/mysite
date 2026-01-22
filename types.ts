
export type Category = 'kivas' | '自剖' | '周身' | '待定' | '愿景';

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: Category;
  timestamp: number;
  section: '当下' | '远方';
}

export enum SectionType {
  PRESENT = '当下',
  DISTANT = '远方'
}
