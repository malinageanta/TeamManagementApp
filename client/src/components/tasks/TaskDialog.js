import * as React from "react";
import { extend } from '@syncfusion/ej2-base';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

export class TaskDialog extends React.Component {
    constructor(props) {
        super(props);
        this.statusData = ["Open", "InProgress", "Review", "Close"];
        this.priorityData = ["Low", "Normal", "High"];
        this.tagsHtmlAttributes = { name: "Tags" };
        this.assigneeData = props.assigneeData;
        this.state = extend({}, {}, props, true);
        this.onChange = this.onChange.bind(this);
        this.onAssigneeChange = this.onAssigneeChange.bind(this);
    }

    onAssigneeChange(args, key) {
        let value = args.itemData;
        this.setState({
            assignee: value,
            email: value.email,
            fullName: value.fullName
        })
    }

    onChange(args, name) {
        let target;
        if (name === undefined) {
            target = args.target;
        } else {
            target = args;
            target.name = name;
        }
        let key = target.name;
        let value = target.value;
        this.setState({ [key]: value });
    }
    itemTemplate(data) {
        return (
            <span><span className='name'>{data.fullName} - {data.email}</span></span>
        );
    }
    render() {
        let data = this.state;
        return (<div>
            <table>
                <tbody>
                    <tr>
                        <td className="e-label">ID</td>
                        <td>
                            <div className="e-float-input e-control-wrapper">
                                <input id="name" name="name" type="text" className="e-field" value={data.name} disabled />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-label">Status</td>
                        <td>
                            <DropDownListComponent change={(e) => this.onChange(e, "status")} id='status' name="status" dataSource={this.statusData} className="e-field" placeholder='Status' value={data.status}></DropDownListComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-label">Assignee</td>
                        <td>
                            <DropDownListComponent change={(e) => this.onAssigneeChange(e, "email")} type="text" name="email" id="email" className="e-field" dataSource={this.assigneeData} placeholder='Assignee' fields={{ text: 'fullName', value: "email" }} value={data.assignee.email} itemTemplate={this.itemTemplate = this.itemTemplate.bind(this)}></DropDownListComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-label">Priority</td>
                        <td>
                            <DropDownListComponent change={(e) => this.onChange(e, "priority")} type="text" name="priority" id="priority" popupHeight='300px' className="e-field" value={data.priority} dataSource={this.priorityData} placeholder='Priority'></DropDownListComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-label">Summary</td>
                        <td>
                            <div className="e-float-input e-control-wrapper">
                                <textarea name="description" className="e-field" value={data.description} onChange={this.onChange.bind(this)}></textarea>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>);
    }
}
