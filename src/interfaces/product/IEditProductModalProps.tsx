import { IProduct } from './IProduct';

export interface IEditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
  onSave: (updatedProduct: IProduct) => void;
}
