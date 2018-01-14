import React, { Component } from 'react'

import { Tasks } from '../api/Tasks'

// Task component - represents a single todo item
export default class Task extends Component {

  deleteThisTask() {
    Tasks.remove(this.props.task._id)
  }

  toggleTaskChecked(event) {
    event.preventDefault()

    Tasks.update(this.props.task._id, {
      $set: { checked: !this.props.task.checked }
    })
  }

  render() {
    const taskClassName = this.props.task.checked ? "checked" : ""

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={() => this.deleteThisTask()}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked || false}
          onClick={(e) => this.toggleTaskChecked(e)}
        />

        <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
}
