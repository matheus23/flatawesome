import React, { Component } from 'react'
import ReactDOM from "react-dom"
import { withTracker } from 'meteor/react-meteor-data'

import { Tasks } from '../api/Tasks'

import Task from './Task'

// App component - represents the whole app
class App extends Component {
	renderTasks() {
		return this.props.tasks.map((task) => (
			<Task key={task._id} task={task} />
		))
	}

	render() {
		return (
			<div className="container">
				<header>
					<h1>Todo List</h1>
				</header>

				<form className="new-task" onSubmit={(e) => this.handleSubmit(e)}>
					<input
						type="text"
						ref="textInput"
						placeholder="Type to add new tasks"
					/>
				</form>

				<ul>
					{this.renderTasks()}
				</ul>
			</div>
		)
	}

	handleSubmit(event) {
		event.preventDefault()

		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim()

		Tasks.insert({
			text: text,
			createdAt: new Date()
		})

		ReactDOM.findDOMNode(this.refs.textInput).value = ""
	}
}

export default withTracker(() => {
	return {
		tasks: Tasks.find({}).fetch(),
	}
})(App)
