import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"
import { checkUserAuthorization, findUserById } from "./Common"
import { findUserFlat } from "./FlatsCollection"

export const FinancesCollection = new Mongo.Collection("finances")
    
if (Meteor.isServer) {
    Meteor.publish("finances", function () {

        if (!this.userId) {
            return FinancesCollection.find(null)
        }

        const flat = findUserFlat(this.userId)
        if (!flat) {
            return FinancesCollection.find(null)
        }

        return FinancesCollection.find({ flatId: flat._id })
    })
}

Meteor.methods({
    "finances.insert"(payment) {
        check(payment, {
            flatId: Mongo.ObjectID,
            spenderId: String,
            sharedWithIds: [String],
            description: String,
            amount: Number,
            date: Date
        })

        FinancesCollection.insert(
            Object.assign({}, payment, {
                _id: new Mongo.ObjectID(),
                createdAt: new Date()
            })
        )
    },

    "finances.remove"(paymentId) {
        check(paymentId, Mongo.ObjectID)

        FinancesCollection.remove(paymentId)
    }
})
