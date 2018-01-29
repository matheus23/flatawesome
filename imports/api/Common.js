import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"

export function checkUserAuthorization(userId) {
    if (!userId) {
        throw new Meteor.Error("not-authorized")
    }
}

export function findUserById(userId, users) {
    return users.find(user => user._id === userId)
}
