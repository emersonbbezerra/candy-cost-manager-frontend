export interface IProductComponent {
  componentId: string;
  componentName: string;
  quantity: number;
  unitOfMeasure?: string;
}

export interface IProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  yield: number;
  unitOfMeasure: string;
  salePrice: number;
  isComponent: boolean;
  productionCost: number;
  productionCostRatio: number;
  components: Array<IProductComponent>;
}
