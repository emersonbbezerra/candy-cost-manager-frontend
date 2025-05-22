import { IProduct, IProductComponent } from '../interfaces/product/IProduct';

interface RawComponent {
  componentId: { $oid: string };
  componentName: string;
  quantity: number;
  unitOfMeasure?: string;
  _id?: { $oid: string };
}

interface RawProduct {
  _id: { $oid: string };
  name: string;
  description: string;
  category: string;
  components: RawComponent[];
  productionCost: number;
  yield: number;
  unitOfMeasure: string;
  productionCostRatio: number;
  salePrice: number;
  isComponent: boolean;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v?: number;
}

export function transformRawProduct(rawProduct: RawProduct): IProduct {
  const components: IProductComponent[] = rawProduct.components.map(c => ({
    componentId: c.componentId.$oid,
    componentName: c.componentName,
    quantity: c.quantity,
    unitOfMeasure: c.unitOfMeasure || '',
  }));

  return {
    id: rawProduct._id.$oid,
    name: rawProduct.name,
    description: rawProduct.description,
    category: rawProduct.category,
    components,
    productionCost: rawProduct.productionCost,
    yield: rawProduct.yield,
    unitOfMeasure: rawProduct.unitOfMeasure,
    productionCostRatio: rawProduct.productionCostRatio,
    salePrice: rawProduct.salePrice,
    isComponent: rawProduct.isComponent,
  };
}
