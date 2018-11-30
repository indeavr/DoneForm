import * as React from 'react';
import {Field} from "./interface";
import {Input} from "reactstrap";

interface FieldProps extends Field {
    onChange: (event: any, dynamic?: boolean) => void;
    invalid: boolean;
    dynamicGen?: boolean
}

class DField extends React.Component<FieldProps> {
    render() {
        const {type} = this.props;
        switch (type) {
            case "text":
            case "email":
            default:
                return <SelectField {...this.props}/>;
            case "select":
                return <SelectField {...this.props}/>;

        }
    }
}

export default DField;

const SelectField: React.SFC<FieldProps> = (props) => {
    const {options, onChange, dynamicGen, ...restProps} = props;

    return (
        <Input {...restProps} onChange={(event: any) => onChange(event, dynamicGen)}>
            {options && options.map((option: string, i: number) => {
                return <option key={option + i} value={option}>{option}</option>;
            })}
        </Input>
    )
};
//
// const TextField: React.SFC<FieldProps> = (props) => {
//     const {options, ...restProps} = props;
//
//     return (
//         <Input {...restProps}/>
//     )
// }