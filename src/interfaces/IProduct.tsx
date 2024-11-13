import { IComponent } from './IComponent';

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  category: string;
  productionCost: number;
  yield: number;
  unitOfMeasure: string;
  salePrice?: number;
  isComponent?: boolean;
  components: IComponent[];
}
