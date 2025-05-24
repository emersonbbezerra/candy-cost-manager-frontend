import { AxiosInstance } from "axios";
import { ReactNode } from "react";
import { IComponent, IComponentCard } from "../component/IComponent";
import { IProduct } from "../product/IProduct";

export interface IApiResponse<T> {
    items: T[];
    pagination: {
        total: number;
        totalPages: number;
        currentPage: number;
    };
}

export interface IExtendedAxiosInstance extends AxiosInstance {
    fetchAvailableComponents: () => Promise<IApiResponse<IComponent>>;
    fetchAvailableProducts: () => Promise<IApiResponse<IProduct>>;
    searchProductsByName: (name: string) => Promise<IProduct[]>;
    searchComponentsByName: (name: string) => Promise<IComponentCard[]>;
}

export interface IPrivateRouteProps {
    children: ReactNode;
}

export interface IRawComponent {
    componentId: { $oid: string };
    componentName: string;
    quantity: number;
    unitOfMeasure?: string;
    _id?: { $oid: string };
}

export interface IRawProduct {
    _id: { $oid: string };
    name: string;
    description: string;
    category: string;
    components: IRawComponent[];
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

export interface ILayoutProps {
    children?: ReactNode;
}