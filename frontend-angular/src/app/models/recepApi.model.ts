export interface ApiMenuItem {
    label: string;
    id: number;
}


export interface ApiMenu {
    label: string;
    items: ApiMenuItem[];
}