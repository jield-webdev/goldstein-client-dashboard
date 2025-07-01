import { ReactNode } from "react";
interface Props {
    goldsteinFQDN: string;
    associationType: string;
    associationID: number;
}
export declare const GoldsteinDataContext: any;
interface GoldsteinDataProviderProps {
    children: ReactNode;
    defaultData: Props;
}
export declare function GoldsteinDataProvider({ children, defaultData }: GoldsteinDataProviderProps): any;
export declare const useGoldsteinClientDataContext: () => any;
export {};
