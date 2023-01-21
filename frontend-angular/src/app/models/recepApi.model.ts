export interface ApiMenuItem {
    label: string;
    id: number;
    commandId: string;
}


export interface ApiMenu {
    label: string;
    items: ApiMenuItem[];
}