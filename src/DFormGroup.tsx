import * as React from 'react';
import {Button, FormFeedback, FormGroup, FormText, Label} from "reactstrap";
import {ReactNode} from "react";
import {Glyphicon} from "react-bootstrap";

interface DFGProps {
    name: string;
    label: string;
    children: ReactNode,
    errorsForField: string[],
    helpText: string;
    removable?: boolean;
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
        const {name, label, children, errorsForField, helpText, removable, onInputRemove} = this.props;


        if (removable && onInputRemove) {
            return (
                <FormGroup>
                    <div style={{display: "inline-block", margin: "0 5px"}}>
                        <Button color="danger"
                                onClick={() => onInputRemove(name)}>
                            <Glyphicon glyph="remove-circle"/>
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