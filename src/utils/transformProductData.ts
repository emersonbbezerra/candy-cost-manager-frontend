import { IProduct, IProductComponent } from '../interfaces/product/IProduct';
import { IRawProduct } from '../interfaces/utils/IUtils';

export function transformRawProduct(rawProduct: IRawProduct): IProduct {
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
