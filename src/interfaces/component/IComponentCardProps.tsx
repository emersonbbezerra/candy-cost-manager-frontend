export interface IComponentCardProps {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  packageQuantity: number;
  unitOfMeasure: string;
  category: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
