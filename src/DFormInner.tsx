import * as React from "react";
import {Button, Form} from "reactstrap";
// import {SyntheticEvent} from "react";
import DField from "./DField";
import {Ref} from "./interface";
import AddDynamicField from "./AddDynamicField";
import DFormGroup from './DFormGroup';

// import {ReactNode} from "react";

interface DFormProps {
    handleInputChange: (event: any, dynamic?: boolean) => void;
    onSubmit: (event: any) => void;
    hasErrors: boolean;
    errors: object;
    fields: object;
    fieldValues: object;
    isSubmitting: boolean;
    remoteSubmit: boolean,
    forwardedRef?: any;
    dynamicAddition?: boolean;
    dynamicFields: object;
    onDynamicAdd?: (key: string) => void
    onInputRemove?: (key: string) => void
}

class DFormInner extends React.Component<DFormProps> {
    constructor(props: DFormProps) {
        super(props);
    }

    displayFields = (fields: object) => {
        const {fieldValues, handleInputChange, errors, onInputRemove} = this.props;

        return Object.keys(fields).map((name) => {
            const {validation, isRequired, initialValue, dynamicGen, removable, ...field} = fields[name];

            const {label, helpText, ...configProps} = field;
            const errorsForField: string[] = errors[name] || [];
            const valueOfField = fieldValues[name] || "";

            const valid = errorsForField.length === 0;

            // fields
            return (
                <DFormGroup key={name}
                            name={name}
                            label={label}
                            errorsForField={errorsForField}
                            helpText={helpText}
                            removable={removable || dynamicGen}
                            onInputRemove={onInputRemove}
                >
                    <DField {...configProps}
                            value={valueOfField || ""}
                            onChange={handleInputChange}
                            dynamicGen={dynamicGen}
                            invalid={!valid}
                    />
                </DFormGroup>
            )
        });
    };


    render() {
        const {
            fields, onSubmit, remoteSubmit, hasErrors, isSubmitting, forwardedRef,
            dynamicAddition, dynamicFields, onDynamicAdd,
        } = this.props;

        return (
            <Form ref={forwardedRef} onSubmit={onSubmit}>
                {this.displayFields(fields)}

                {dynamicAddition && Object.keys(dynamicFields).length > 0
                && this.displayFields(dynamicFields)}

                {dynamicAddition && onDynamicAdd
                && <AddDynamicField onDynamicAdd={onDynamicAdd}/>}

                {!remoteSubmit && (<Button type="submit"
                                           disabled={hasErrors || isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>)}
            </Form>
        );
    }
}

export default React.forwardRef<Ref, DFormProps>((props, ref) =>
    (<DFormInner {...props} forwardedRef={ref}/>)
);