import * as React from 'react';
import {Button, FormFeedback, FormGroup, FormText, Label} from "reactstrap";

interface DFGProps {
    name: string;
    label: string;
    children: React.ReactNode,
    errorsForField: string[],
    helpText: string;
    dynamicGen?: boolean;
    onInputRemove?: (key: string) => void;
}

class DFormGroup extends React.Component<DFGProps> {
    displayErrors = (currErrors: string[]) => {
        if (!currErrors) {
            return null;
        }

        return currErrors.map((error: string, i) => {
            return (
                <FormFeedback
                    key={error + i}>
                    {error}
                </FormFeedback>
            )
        })
    };

    render() {
        const {name, label, children, errorsForField, helpText, dynamicGen, onInputRemove} = this.props;


        if (dynamicGen && onInputRemove) {
            return (
                <FormGroup>
                    <div style={{display: "inline-block", margin: "0 5px"}}>
                        <Button color="danger"
                                onClick={() => onInputRemove(name)}>
                            {/* <Glyphicon glyph="remove-circle"/> */}
                        </Button>
                    </div>
                    <div style={{display: "inline-block", width: "75%"}}>
                        <Label for="exampleEmail">{label}</Label>
                        {children}
                    </div>
                    {this.displayErrors(errorsForField)}
                    {helpText !== undefined && <FormText>{helpText}</FormText>}
                </FormGroup>
            )
        }

        return (
            <FormGroup>
                <Label for="exampleEmail">{label}</Label>
                {children}
                {this.displayErrors(errorsForField)}
                {helpText !== undefined && <FormText>{helpText}</FormText>}
            </FormGroup>
        );
    }
}

export default DFormGroup;