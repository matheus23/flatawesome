import React, { Component } from "react"
import ReactDOM from "react-dom"
import { withTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"

import { 
	Container, 
	Media, 
	ListGroup,
	Form,
	FormGroup,
	FormText,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	Label,
	Col
} from "reactstrap"

import { Tasks } from "../api/Tasks"

import Task from "./Task"
import AccountsUIWrapper from "./AccountsUIWrapper"

// App component - represents the whole app
class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			publishPrivately: false
		}
	}

	renderTasks() {
		return this.props.tasks.map((task) => (
			<Task key={task._id} task={task} />
		))
	}

	render() {
		return (
			<Container>
				<Media body>
					<h1 className="font-weight-light">The greatest TODO app of all time</h1>

					<Form onSubmit={(e) => this.handleSubmit(e)}>
						<FormGroup row>
							<Label for="login-buttons" sm={2}>Choose account</Label>
							<Col>
								<AccountsUIWrapper />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="add-task" sm={2}>What to do?</Label>
							<Col>
								<Input id="add-task" type="text" ref="textInput" placeholder="Type to add new tasks" />
							</Col>
						</FormGroup>
						<FormGroup row check>
							<Col sm={{ size: 10, offset: 2 }}>
								<Label check>
									<Input id="publish-privately" type="checkbox" ref="privateCheckbox" onClick={() => this.togglePrivate()}/>
									Publish privately
								</Label>
							</Col>
						</FormGroup>
					</Form>

					<ListGroup>
						{this.renderTasks()}
					</ListGroup>
				</Media>
			</Container>
		)
	}

	togglePrivate() {
		this.setState({
			publishPrivately: !this.state.publishPrivately
		})
	}

	handleSubmit(event) {
		event.preventDefault()

		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim()

		Meteor.call("task.insert", text, this.state.publishPrivately)

		ReactDOM.findDOMNode(this.refs.textInput).value = ""
	}
}

export default withTracker(() => {
	Meteor.subscribe("tasks")

	return {
		tasks: Tasks.find().fetch(),
		currentUser: Meteor.user()
	}
})(App)
