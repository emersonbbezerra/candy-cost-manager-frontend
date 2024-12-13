export interface IComponent {
  componentId: string;
  componentName: string;
  quantity: number;
}

export interface IComponentCard {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  packageQuantity: number;
  unitOfMeasure: string;
  category: string;
}
