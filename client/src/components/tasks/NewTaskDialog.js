import * as React from "react";
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { createTask } from '../../actions/taskActions';
import { Alert } from '@material-ui/lab';
import '../../css/Members.css';



class NewTaskDialog extends React.Component {
    constructor(props) {
        super(props);
        this.statusData = ["Open", "InProgress", "Review", "Close"];
        this.typeData = ["Analysis", "Design", "Implementation", "Integration", "Testing"];
        this.priorityData = ["Low", "Normal", "High"];
        this.tagsHtmlAttributes = { name: "Tags" };
        this.assigneeData = props.assigneeData;

        this.state = {
            name: "",
            type: "",
            assignee: "",
            priority: "",
            description: "",
            errorMsg: null
        };
        this.changeFormOpenState = props.changeFormOpenState;
        this.onChange = this.onChange.bind(this);
        this.onAssigneeChange = this.onAssigneeChange.bind(this);
        this.handleAddTask = this.handleAddTask.bind(this);
        this.onSimpleChange = this.onSimpleChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'CREATE_TASK_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ errorMsg: null });
            }
        }
    }

    onAssigneeChange(e) {
        this.setState({
            assignee: e.value
        })
    }

    onSimpleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
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

    handleAddTask() {
        const taskData = {
            name: this.state.name,
            type: this.state.type,
            assignee: this.state.assignee,
            priority: this.state.priority,
            description: this.state.description,
            currentTeam: this.props.team.name
        }

        this.props.createTask(taskData)
            .then(async (res) => {
                if (res === 202) {
                    this.changeFormOpenState(false);
                }
            })

    }

    render() {
        const alert = <Alert severity="error"> {this.state.errorMsg} </Alert>

        return (<div className=" e-lib e-dialog e-control e-kanban-dialog e-kanban-form-wrapper e-kanban-form-container">
            <form className="kanban-fonts e-kanban-form e-lib e-formvalidator">
                <DialogTitle id="form-dialog-title" className="add-task-dialog-title">Create a new task!</DialogTitle>
                <DialogContent>
                    <table style={{ minWidth: "330px" }}>
                        <tbody>
                            <tr>
                                <td className="e-label">Title</td>
                                <td>
                                    <div className="e-float-input e-control-wrapper">
                                        <input id="name" onChange={this.onSimpleChange} name="name" className="e-field" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="e-label">Type</td>
                                <td>
                                    <DropDownListComponent change={(e) => this.onChange(e, "type")} id='type' name="type" dataSource={this.typeData} className="e-field"></DropDownListComponent>
                                </td>
                            </tr>
                            <tr>
                                <td className="e-label">Assignee</td>
                                <td>
                                    <DropDownListComponent change={(e) => this.onAssigneeChange(e, "assignee")} type="text" name="assignee" id="assignee" className="e-field" dataSource={this.assigneeData} fields={{ text: 'fullName', value: "email" }} itemTemplate={this.itemTemplate = this.itemTemplate.bind(this)}></DropDownListComponent>
                                </td>
                            </tr>
                            <tr>
                                <td className="e-label">Priority</td>
                                <td>
                                    <DropDownListComponent change={(e) => this.onChange(e, "priority")} type="text" name="priority" id="priority" popupHeight='300px' className="e-field" dataSource={this.priorityData}></DropDownListComponent>
                                </td>
                            </tr>
                            <tr>
                                <td className="e-label">Summary</td>
                                <td>
                                    <div className="e-float-input e-control-wrapper">
                                        <textarea name="description" className="e-field" onChange={this.onSimpleChange}></textarea>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </DialogContent>
                {this.state.errorMsg ? alert : null}
                <DialogActions>
                    <Button onClick={() => this.handleAddTask()} className="add-member-submit">
                        Add
                </Button>
                    <Button onClick={() => this.changeFormOpenState(false)} className="add-member-cancel">
                        Cancel
                </Button>
                </DialogActions>
            </form>
        </div>);
    }
}

const mapStateToProps = state => ({
    team: state.team.team,
    error: state.error
});

export default connect(mapStateToProps, { createTask })(NewTaskDialog);