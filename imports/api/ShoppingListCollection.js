import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"
import { checkUserAuthorization } from "./Common"
import { FlatsCollection, findUserFlat, getUserFlat } from "./FlatsCollection"

export const ShoppingListCollection = new Mongo.Collection("shoppingList")
    
if (Meteor.isServer) {
    Meteor.publish("shoppingList", function () {
        if (!this.userId) {
            return ShoppingListCollection.find(null)
        }

        const flat = findUserFlat(this.userId)
        if (!flat) {
            return ShoppingListCollection.find(null)
        }

        return ShoppingListCollection.find({ flatId: flat._id })
    })
}

Meteor.methods({
    "shoppingList.insert"(text) {
        check(text, String)

        checkUserAuthorization(this.userId)

        const flat = getUserFlat(this.userId, "You need to be in a flat to add shopping list items")

        ShoppingListCollection.insert({
            _id: new Mongo.ObjectID(),
            flatId: flat._id,
            text: text,
            checked: false,
            createdAt: new Date(),
            userId: this.userId,
        })
    },

    "shoppingList.remove"(itemId) {
        check(itemId, Mongo.ObjectID)

        checkItemIdAuthorization(itemId, this.userId)

        ShoppingListCollection.remove(itemId)
    },

    "shoppingList.setChecked"(itemId, checked) {
        check(itemId, Mongo.ObjectID)
        check(checked, Boolean)

        checkItemIdAuthorization(itemId, this.userId)

        ShoppingListCollection.update(itemId, { $set: { checked: checked }})
    }
})

function checkItemIdAuthorization(itemId, userId) {
    checkUserAuthorization(userId)

    const item = ShoppingListCollection.findOne(itemId)
    if (!item) {
        throw new Meteor.Error("not-found")
    }

    const flat = FlatsCollection.findOne(item.flatId)
    if (!flat) {
        throw new Meteor.Error("invalid-operation")
    }

    if (!flat.members.includes(userId)) {
        throw new Meteor.Error("not-authorized")
    }
}
