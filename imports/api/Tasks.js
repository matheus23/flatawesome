import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"
import { Counts } from "meteor/tmeasday:publish-counts"

export const Tasks = new Mongo.Collection("tasks")
    
if (Meteor.isServer) {
    Meteor.publish("tasks", function () {
        Counts.publish(this, "tasksCount", Tasks.find())

        if (!this.userId) {
            return Tasks.find({
                private: { $ne: true }
            })
        }
        return Tasks.find({
            $or: [
                { private: { $ne: true } },
                { userId: this.userId }
            ]
        })
    })
}

Meteor.methods({
    "task.insert"(text, publishPrivately) {
        check(text, String)
        check(publishPrivately, Boolean)

        if (!this.userId) {
            throw new Meteor.Error("not-authorized")
        }

        Tasks.insert({
            text: text,
            private: publishPrivately,
            createdAt: new Date(),
            userId: this.userId,
            username: Meteor.users.findOne(this.userId).username
        })
    },

    "task.remove"(taskId) {
        check(taskId, String)

        if (Tasks.findOne(taskId).userId !== this.userId) {
            throw new Meteor.Error("not-authorized")
        }

        Tasks.remove(taskId)
    },

    "task.setChecked"(taskId, checked) {
        check(taskId, String)
        check(checked, Boolean)

        Tasks.update(taskId, { $set: { checked: checked }})
    }
})