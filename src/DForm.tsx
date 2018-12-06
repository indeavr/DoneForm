import * as React from 'react';
import DFormInner from "./DFormInner";
import {Field, Ref} from "./interface";
import deepEqual from 'deep-equal';

export interface FormOptions {
    fields: ApiField[];
    onSubmit: (values: object) => void; // values: [name]: value
    submitSettings?: SubmitSettings;
    type?: any; // will be enum for different styles of forms;
    forwardedRef?: any;
    dynamicAddition?: boolean,
}

interface SubmitSettings {
    isSubmitting: boolean;
    remoteSubmit: boolean;
}

export class DFormApi {
    public validate = {
        email: (value: string) => this.validateEmail(value),
        numberBetween: (min: number, max: number, value: string) => {
            const valueAsNum: number = Number(value);

            if (isNaN(valueAsNum)) {
                return false;
            }

            return valueAsNum >= min && valueAsNum <= max;
        }
    };

    validateEmail = (value: string) => {
        const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const valid = emailPattern.test(String(value).toLowerCase());

        return valid;
    }
}

type addErrorFunc = (errorMes: string) => void;

type validateFunc = (value: any, addError: addErrorFunc, api: DFormApi)
    => void;

export interface ApiField extends Field {
    validation?: validateFunc;
    isRequired?: boolean;
    initialValue?: any;
}

const transformFields = (apiFields: ApiField[]) => {
    const errors: object = {};
    const innerFields: object = {};
    const innerDynamicFields: object = {};
    const initialFieldValues: object = {};

    apiFields.forEach(apiField => {
        const {name, initialValue, type, removable, options} = apiField;
        errors[name] = [];

        if (removable) {
            innerDynamicFields[name] = {...apiField};
        }
        else {
            innerFields[name] = {...apiField};
        }
        if (type === "select") {
            if (options) {
                initialFieldValues[name] = options[0];
            }
            else {
                console.error("You must provide `options` for a select field")
            }
        }

        if (initialValue) {
            initialFieldValues[name] = initialValue;
        }
    });

    return {
        errors: errors,
        fields: innerFields,
        fieldValues: initialFieldValues,
        dynamicFields: innerDynamicFields,
    }
};

class FormState {
    public fields: object;
    public fieldValues: object; // [name] : value
    public errors: object;
    public isSubmitting: boolean;
    public hasErrors: boolean;
    public dynamicFields: object;

    constructor(apiFields: ApiField[]) {
        const {fields, errors, fieldValues, dynamicFields} = transformFields(apiFields);

        // TODO: make this shape of field to be from beginning
        this.fields = fields;
        this.fieldValues = fieldValues;
        this.errors = errors;
        this.isSubmitting = false;
        this.hasErrors = true;
        this.dynamicFields = dynamicFields;
    }
}

export class DForm extends React.Component<FormOptions> {
    constructor(props: FormOptions) {
        super(props);
    }

    componentWillReceiveProps(nextProps: FormOptions) {
        if (!deepEqual(nextProps.fields, this.props.fields)) {
            const {fields: newFields, fieldValues: newFieldValues} = transformFields(nextProps.fields);

            this.setState({
                fields: newFields,
                fieldValues: newFieldValues
            })
        }
    }

    //
    // componentWillUnmount() {
    //     const {fieldValues} = this.state;
    //
    //     const containsAtLeastOneValue: boolean = Object.keys(fieldValues).some(key => fieldValues[key].length > 0);
    //
    //     if (containsAtLeastOneValue) {
    //         window.confirm('Are you sure you want to close');
    //         return false;
    //     }
    //
    //     return true;
    // }

    state = new FormState(this.props.fields);

    api = new DFormApi();

    validate = (value: any, name: string) => {
        const {fields} = this.state;

        const errors: string[] = [];
        const validateFunc: validateFunc = fields[name].validation;

        const addErrorFunc = (error: string) => {
            errors.push(error);
        };

        if (value === undefined || value === "") {
            const {isRequired} = fields[name];

            if (isRequired) {
                addErrorFunc("Field is Required !")
            }
        }

        if (!validateFunc) {
            return [];
        }

        validateFunc(value, addErrorFunc, this.api);
        return errors
    };

    handleInputChange = (event: React.MouseEvent, dynamic?: boolean) => {
        // event.preventDefault();

        const {name, value} = event.target as HTMLInputElement;
        // dynamic fields dont need validation
        const errors: string[] = dynamic
            ? []
            : this.validate(value, name);

        this.setState((prevState: FormState) => ({
            fieldValues: {
                ...prevState.fieldValues,
                [name]: value
            },
            errors: {
                ...prevState.errors,
                [name]: errors
            }
        }))
    };

    checkForErrors = () => {
        const {errors} = this.state;
        const hasAtLeastOneError = Object.keys(errors)
            .some(key => errors[key].length !== 0);

        return hasAtLeastOneError;
    };

    onInputAddClick = (key: string) => {
        if (!key) {
            return;
        }

        const newField = {
            name: key,
            type: "text",
            label: key,
            placeholder: key,
            dynamicGen: true
        };

        this.setState((prevState: FormState) => {
            return {
                dynamicFields: {
                    ...prevState.dynamicFields,
                    [key]: newField
                }
            };
        })
    };

    onInputRemove = (removeKey: string) => {
        const {dynamicFields, fieldValues} = this.state;

        const nextDynamicFields = Object.keys(dynamicFields)
            .reduce((clearedDyFields: Field[], key: string) => {
                if (key !== removeKey) {
                    clearedDyFields[key] = dynamicFields[key];
                }

                return clearedDyFields;
            }, {});

        const filteredFieldValues = Object.keys(fieldValues)
            .reduce((clearedDyFields: Field[], key: string) => {
                if (key !== removeKey) {
                    clearedDyFields[key] = fieldValues[key];
                }

                return clearedDyFields;
            }, {});

        this.setState({
            dynamicFields: nextDynamicFields,
            fieldValues: filteredFieldValues
        })
    };

    hasRequiredFieldNotSupplied = () => {
        const {fieldValues, fields, errors} = this.state;

        let hadErrors = false;
        Object.keys(fields).forEach((name: string) => {
            const {isRequired} = fields[name];
            if (isRequired) {
                const value = fieldValues[name];
                if (value === undefined || value === "" || value === null) {
                    const currErrors = errors[name];

                    hadErrors = true;
                    this.setState((prevState: FormState) => ({
                        errors: {
                            ...prevState.errors,
                            [name]: [...currErrors, "Field is required !"]
                        }
                    }))
                }
            }
        });

        return hadErrors;
    };

    onSubmitDForm = (event: any) => {
        event.preventDefault();

        const {fieldValues} = this.state;
        const {submitSettings} = this.props;

        if (this.hasRequiredFieldNotSupplied() ||
            submitSettings && submitSettings.isSubmitting) {
            return;
        }

        const {onSubmit} = this.props;

        if (!onSubmit) {
            console.error("please provide on submit handler to form props");
            return;
        }
        onSubmit(fieldValues);
    };

    render() {
        const {errors, fields, fieldValues, dynamicFields} = this.state;
        const {submitSettings, forwardedRef, dynamicAddition} = this.props;

        return (
            <DFormInner ref={forwardedRef}
                        handleInputChange={this.handleInputChange}
                        onSubmit={this.onSubmitDForm}
                        hasErrors={this.checkForErrors()}
                        errors={errors}
                        fields={fields}
                        isSubmitting={submitSettings ? submitSettings.isSubmitting : false}
                        remoteSubmit={submitSettings ? submitSettings.remoteSubmit : false}
                        fieldValues={fieldValues}
                        dynamicAddition={dynamicAddition}
                        dynamicFields={dynamicFields}
                        onDynamicAdd={this.onInputAddClick}
                        onInputRemove={this.onInputRemove}
            />
        )
    }
};

export default React.forwardRef<Ref, FormOptions>((props, ref) =>
    (<DForm {...props} forwardedRef={ref}/>)
);