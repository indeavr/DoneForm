import * as React from 'react';
import {Button, Input, Label} from "reactstrap";

interface DynamicFieldProps {
    onDynamicAdd: (key: string) => void
}

class DynamicFieldState {
    key: string;
}

class AddDynamicField extends React.Component<DynamicFieldProps, DynamicFieldState> {

    onChange = (event: any) => {
        const {value} = event.target;

        this.setState({
            key: value
        })
    };

    render() {
        return (
            <div>
                <div style={{display: "inline-block", width: "35%"}}>
                    <Label for="key">New Key</Label>
                    <Input type="text"
                           name="key"
                           onChange={this.onChange}/>
                </div>
                <div style={{display: "inline-block", marginLeft: "5px"}}>
                    <Button color="success"
                            onClick={() => this.props.onDynamicAdd(this.state.key)}>
                        {/* <Glyphicon glyph="plus-sign"/> */}
                    </Button>
                </div>
            </div>
        );
    }
}

export default AddDynamicField;