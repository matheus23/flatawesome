import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"

export const ShoppingListCollection = new Mongo.Collection("shoppingList")
    
if (Meteor.isServer) {
    Meteor.publish("shoppingList", function () {
        return ShoppingListCollection.find()
    })
}

Meteor.methods({
    "shoppingList.insert"(text) {
        check(text, String)

        ShoppingListCollection.insert({
            _id: new Mongo.ObjectID(),
            text: text,
            checked: false,
            createdAt: new Date(),
            userId: this.userId,
        })
    },

    "shoppingList.remove"(itemId) {
        check(itemId, Mongo.ObjectID)

        ShoppingListCollection.remove(itemId)
    },

    "shoppingList.setChecked"(itemId, checked) {
        check(itemId, Mongo.ObjectID)
        check(checked, Boolean)

        ShoppingListCollection.update(itemId, { $set: { checked: checked }})
    }
})
