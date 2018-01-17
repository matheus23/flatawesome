import React, { Component } from "react"

import { Meteor } from "meteor/meteor"

import { 
  ListGroupItem,
  InputGroup,
  InputGroupAddon,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap"

import { Tasks } from "../api/Tasks"

import classnames from "classnames"

// Task component - represents a single todo item
export default class Task extends Component {

  deleteThisTask() {
    Meteor.call("task.remove", this.props.task._id)
  }

  toggleTaskChecked(event) {
    event.preventDefault()

    Meteor.call("task.setChecked", this.props.task._id, !this.props.task.checked)
  }

  render() {
    const taskClassName = classnames({
      "task-checked": this.props.task.checked,
      "private": this.props.task.private
    })

    const taskTextClassName = classnames({ 
      checked: this.props.task.checked
    })

    return (
      <ListGroupItem className={taskClassName} onClick={(e) => this.toggleTaskChecked(e)}>
          <button 
            className="delete" 
            onClick={() => this.deleteThisTask()}
            disabled={Meteor.userId() !== this.props.task.userId}
          >
            &times;
          </button>
          
          <div className={taskTextClassName}>{this.props.task.text}</div>
          <small>{this.props.task.username}</small>
      </ListGroupItem>
    );
  }
}
