export class ProductDto {
  name: string;
  description: string;
  status: 'Draft' | 'Listed' | 'Archive';
  tags: string[];
}
