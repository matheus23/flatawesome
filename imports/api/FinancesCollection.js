import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"

export const FinancesCollection = new Mongo.Collection("finances")
    
if (Meteor.isServer) {
    Meteor.publish("finances", function () {
        return FinancesCollection.find();
    })
}

Meteor.methods({
    "finances.insert"(payment) {
        check(payment, {
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
