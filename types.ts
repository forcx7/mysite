
export type Category = 
  | '齐七的诗' | '蝶野漫步' | '周身光影' 
  | '米悬的梦' | '未至草原' | '晨曦初现' | '待定';

export type BlockType = 'text' | 'image';

export interface ContentBlock {
  id: string;
  type: BlockType;
  value: string;
}

export interface Post {
  id: string;
  title: string;
  blocks: ContentBlock[];
  category: Category;
  timestamp: number;
  section: SectionType;
}

export enum SectionType {
  PRESENT = '当下',
  DISTANT = '远方'
}
