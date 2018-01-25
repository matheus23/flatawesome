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
            spenderId: Mongo.ObjectID,
            recieverIds: [Mongo.ObjectID],
            amount: Number,
            date: Date,
            createdAt: Date
        })

        FinancesCollection.insert(
            Object.assign({}, payment, {
                _id: new Mongo.ObjectID()
            })
        )
    },

    "finances.remove"(paymentId) {
        check(paymentId, Mongo.ObjectID)

        FinancesCollection.remove(paymentId)
    }
})
