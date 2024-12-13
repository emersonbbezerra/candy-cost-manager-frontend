import { IEditComponentData } from './IEditComponentData';

export interface IEditComponentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IEditComponentData) => void;
  component: {
    id: string;
    name: string;
    manufacturer: string;
    price: number;
    packageQuantity: number;
    unitOfMeasure: string;
    category: string;
  };
}
