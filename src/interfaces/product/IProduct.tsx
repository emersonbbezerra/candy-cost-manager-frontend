export interface IProductComponent {
  componentId: string;
  componentName: string;
  quantity: number;
}

export interface IProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  yield: number;
  yieldUnit: string;
  salePrice: number;
  isComponent: boolean;
  productionCost: number;
  productionCostRatio: number;
  components: Array<IProductComponent>;
}
