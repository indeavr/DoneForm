export interface Field {
    name: string;
    type: any;
    options?: string[];
    label?: string;
    placeholder?: string;
    helpText?: string;
    value?: any;
    removable?: boolean;
    disabled?: boolean;
}

export type Ref = HTMLDivElement;


