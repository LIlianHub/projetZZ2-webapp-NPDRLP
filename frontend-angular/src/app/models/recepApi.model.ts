export interface ApiMenuItem {
    label: string;
    id: number;
    routerLink: string;
}

export interface ApiMenu {
    label: string;
    items: ApiMenuItem[];
    id: number;
}