// Content type definitions
export type ContentType = 'text' | 'title' | 'table' | 'button' | 'card' | 'grid';

// Base interface for all content types
export interface BaseContent {
  id: string;
  type: ContentType;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Text content
export interface TextContent extends BaseContent {
  type: 'text';
  content: string;
  format?: 'plain' | 'markdown' | 'html';
}

// Title content
export interface TitleContent extends BaseContent {
  type: 'title';
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  alignment?: 'left' | 'center' | 'right';
}

// Table content
export interface TableCell {
  id: string;
  content: string;
  colspan?: number;
  rowspan?: number;
}

export interface TableRow {
  id: string;
  cells: TableCell[];
}

export interface TableContent extends BaseContent {
  type: 'table';
  headers: TableCell[];
  rows: TableRow[];
  caption?: string;
  striped?: boolean;
  hoverable?: boolean;
}

// Button content
export interface ButtonContent extends BaseContent {
  type: 'button';
  text: string;
  url: string;
  variant: 'default' | 'outline' | 'secondary' | 'primary';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  openInNewTab?: boolean;
}

// Card content
export interface CardContent extends BaseContent {
  type: 'card';
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  footer?: string;
  actions?: Array<{
    id: string;
    text: string;
    url: string;
    variant?: ButtonContent['variant'];
  }>;
}

// Grid content
export interface GridItem {
  id: string;
  content: string;
  colStart?: number;
  rowStart?: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface GridContent extends BaseContent {
  type: 'grid';
  columns: number;
  rows: number;
  items: GridItem[];
  gap?: number;
  responsive?: boolean;
}

// Union type of all content types
export type Content = 
  | TextContent 
  | TitleContent 
  | TableContent 
  | ButtonContent 
  | CardContent 
  | GridContent;

// Type guard functions
export const isTextContent = (content: Content): content is TextContent => 
  content.type === 'text';

export const isTitleContent = (content: Content): content is TitleContent =>
  content.type === 'title';

export const isTableContent = (content: Content): content is TableContent =>
  content.type === 'table';

export const isButtonContent = (content: Content): content is ButtonContent =>
  content.type === 'button';

export const isCardContent = (content: Content): content is CardContent =>
  content.type === 'card';

export const isGridContent = (content: Content): content is GridContent =>
  content.type === 'grid';