export interface Field {
    name: string;
    type: any;
    options?: string[];
    label?: string;
    placeholder?: string;
    helpText?: string;
    value?: any;
}

export type Ref = HTMLDivElement;