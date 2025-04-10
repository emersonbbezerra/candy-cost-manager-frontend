export interface IProductCardProps {
  id: string;
  name: string;
  category: string;
  yield: number;
  unitOfMeasure: string;
  isComponent: boolean;
  productionCost: number;
  productionCostRatio: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
