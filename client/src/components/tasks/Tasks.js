import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../css/Tasks.css';
import NavBar from '../NavBar';
import { extend, addClass } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-kanban";
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { Query } from '@syncfusion/ej2-data';
import axios from '../../axios';
import { getState } from '../../store';
import { Avatar, IconButton } from '@material-ui/core';
import { TaskDialog } from './TaskDialog';
import { getTeamTasks, setTaskItems, deleteTask } from '../../actions/taskActions';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Dialog from '@material-ui/core/Dialog';
import NewTaskDialog from './NewTaskDialog';



class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorMsg: null,
            statusData: ["Open", "InProgress", "Review", "Done"],
            priorityData: ["Low", "Normal", "High"],
            assigneesData: [],
            formOpen: false,
            taskToBeAdded: {},
        }

        this.isCancelled = false;

        this.statusData = ["Open", "InProgress", "Review", "Close"];
        this.priorityData = ["Low", "Normal", "High"];

        this.getString = this.getString.bind(this);
        this.getUserIcon = this.getUserIcon.bind(this);
        this.cardTemplate = this.cardTemplate.bind(this);
        this.dialogTemplate = this.dialogTemplate.bind(this);
        this.updateTaskData = this.updateTaskData.bind(this);
        this.onActionComplete = this.onActionComplete.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.getAddTaskForm = this.getAddTaskForm.bind(this);
    }


    getAllMembers(getState) {
        let config = {
            params: {
                team: this.props.user?.team
            }
        }

        return axios.get('/users', config)
            .then(res => {
                if (!this.isCancelled) {
                    let assignees = []
                    for (const item of res.data) {
                        const a = { fullName: item.lastName + ' ' + item.firstName, email: item.email }
                        assignees.push(a)
                    }
                    this.setState({
                        assigneesData: assignees
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    async componentDidMount() {
        await this.getAllMembers(getState);
        this.props.getTeamTasks(this.props.user?.team)
            .then((res) => {
                if (!this.isCancelled) {
                    this.setState({
                        data: res
                    })
                }
            })
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    getString(assignee) {
        const resultedCh = assignee.match(/\b(\w)/g);
        let ch = [];
        if (resultedCh.length > 2) {
            ch.push(resultedCh[0]);
            ch.push(resultedCh[resultedCh.length - 1]);
            return ch.join("").toUpperCase();
        }
        return resultedCh.join("").toUpperCase();
    }

    getUserIcon(member) {
        let image = null;
        if (member.photo) {
            image = <Avatar alt='user_photo' src={`${member.photo}`} className="task-avatar" />
        }
        else {
            const ch = this.getString(member.fullName);
            image = <Avatar className="task-avatar-default">{ch}</Avatar>
        }

        return image;
    }

    cardRendered(args) {
        let val = args.data.priority;
        addClass([args.element], val);
    }

    async onActionComplete(e) {
        if (!e.cancel) {
            if (e.requestType === "cardChanged" && e.changedRecords.length) {
                this.updateTaskData(e.changedRecords[0]);
            }
            else if (e.requestType === "cardRemoved") {
                await this.props.deleteTask(e.deletedRecords[0]._id, this.props.team.name);
                await this.getAllMembers(getState);
            }
        }
    }

    swimlaneTemplate(data) {
        return (
            <div className='swimlane-template e-swimlane-template-table'>
                <div className="e-swimlane-row-text">
                    <div className="e-swimlane-text">{data.textField} - {data.keyField}</div>
                </div>
            </div>
        );
    }

    columnTemplate(data) {
        return (<div className="header-template-wrap">
            <div className={"header-icon e-icons " + data.keyField}></div>
            <div className="header-text">{data.headerText}</div>
        </div>);
    }

    cardTemplate(data) {
        const icon = this.getUserIcon(data);
        return (<div className={"card-template"}>
            <div className="e-card-header">
                <div className="e-card-header-caption">
                    <div className="e-card-header-title e-tooltip-text">{data.name}</div>
                </div>
            </div>
            <div className="e-card-content e-tooltip-text">
                <div className="e-text">{data.description}</div>
            </div>
            <div className="e-card-custom-footer">
                <div className="e-card-tag-field e-tooltip-text">{data.type}</div>
                <div className="e-card-tag-field e-tooltip-text">{data.priority}</div>
                <div className="task-icon-div">{icon}</div>
            </div>
        </div>);
    }

    async updateTaskData(assigneeData) {
        const newAssignee = this.state.assigneesData.find(x => x.email === assigneeData.email);
        if (!newAssignee) {
            return;
        }

        await this.props.setTaskItems(assigneeData._id, assigneeData, this.props.team.name);
        await this.getAllMembers(getState);
    }

    searchClick(e) {
        let searchValue = e.value;
        let searchQuery = new Query();
        if (searchValue !== '') {
            searchQuery = new Query().search(searchValue, ['name', 'description', 'type', 'fullName', 'priority'], 'contains', true);
        }
        this.kanbanObj.query = searchQuery;
    }

    onFocus(e) {
        if (e.target.value === '') {
            this.reset();
        }
    }
    reset() {
        this.kanbanObj.query = new Query();
    }


    dialogTemplate(props) {
        const data = extend({ assigneeData: this.state.assigneesData }, { ...props }, null, true)
        return (<TaskDialog {...data} />);
    }

    handleFormClose() {
        this.setState({
            formOpen: false,
            errorMsg: null
        })
    }

    handleFormOpen() {
        this.setState({
            formOpen: true
        })
    }

    getAddTaskForm(props) {
        return (<div>
            <Dialog open={this.state.formOpen} onClose={() => this.handleFormClose()} aria-labelledby="form-dialog-title">
                <NewTaskDialog {...{ assigneeData: this.state.assigneesData }} changeFormOpenState={(formOpenNewValue) => this.setState({ formOpen: formOpenNewValue })} />
            </Dialog>
        </div >);
    }

    render() {
        const form = this.getAddTaskForm();
        return (
            <div>
                <div style={{ paddingBottom: "9px" }}>
                    <NavBar />
                </div>
                <div className='kanban-control-section'>
                    <div className="col-lg-6 property-section search-div-center" style={{ paddingBottom: "6px" }}>
                        <div className="property-panel-section" style={{ width: "96vw" }}>
                            <div className="property-panel-header">Search</div>
                            <div className="property-panel-content">
                                <table className="e-filter-table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <TextBoxComponent cssClass="search-textBox" className="search-textBox" id="search_text" ref={(kanban) => { this.textBoxObj = kanban; }} value="" placeholder="Enter search text" showClearButton={true} onFocus={this.onFocus.bind(this)} input={this.searchClick.bind(this)} />
                                                <IconButton color="primary" className="addMember" id="addMember" onClick={this.handleFormOpen} style={{ float: "right", marginBottom: "6px", marginRight: "10px" }}> <AddCircleOutlineIcon /> </IconButton>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-12 control-section'>
                        <div className='control-wrapper'>
                            <KanbanComponent actionComplete={this.onActionComplete} id="kanban" ref={(kanban) => { this.kanbanObj = kanban; }} cssClass="kanban-overview" keyField="status" dataSource={this.props.tasks}
                                enableTooltip={true} swimlaneSettings={{ keyField: "email", textField: "fullName", template: this.swimlaneTemplate.bind(this) }}
                                cardSettings={{ headerField: "name", template: this.cardTemplate.bind(this), selectionType: "Multiple" }}
                                dialogSettings={{ textContent: "gad", template: this.dialogTemplate }} cardRendered={this.cardRendered.bind(this)}>

                                <ColumnsDirective>
                                    <ColumnDirective headerText="To Do" keyField="Open" allowToggle={true} template={this.columnTemplate.bind(this)} />
                                    <ColumnDirective headerText="In Progress" keyField="InProgress" allowToggle={true} template={this.columnTemplate.bind(this)} />
                                    <ColumnDirective headerText="In Review" keyField="Review" allowToggle={true} template={this.columnTemplate.bind(this)} />
                                    <ColumnDirective headerText="Done" keyField="Close" allowToggle={true} template={this.columnTemplate.bind(this)} />
                                </ColumnsDirective>
                            </KanbanComponent>
                        </div>
                    </div>
                    {form}
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    team: state.team.team,
    error: state.error,
    tasks: state.task.tasks
});

export default connect(mapStateToProps, { getTeamTasks, setTaskItems, deleteTask })(Tasks);