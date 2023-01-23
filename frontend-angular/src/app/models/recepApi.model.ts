export interface ApiMenuItem {
    label: string;
    id: number;
    link: string;
}

export interface ApiMenu {
    label: string;
    items: ApiMenuItem[];
    id: number;
}