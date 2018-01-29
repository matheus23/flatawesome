import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"
import { publishComposite } from "meteor/reywood:publish-composite"
import { checkUserAuthorization } from "./Common"

export const FlatsCollection = new Mongo.Collection("flats")

if (Meteor.isServer) {
    publishComposite("flats", {
        find() {
            if (!this.userId) {
                return FlatsCollection.find(null)
            }

            // Only return flats that you're a part of or got invited to
            return FlatsCollection.find({
                $or: [
                    { members: { $elemMatch: {  $eq: this.userId } } },
                    { invitations: { $elemMatch: {  $eq: this.userId } } }
                ]
            })
        },
        children: [
            {
                find(flat) {
                    return Meteor.users.find({
                        $or: [
                            { _id: { $in: flat.members } },
                            { _id: { $in: flat.invitations } }
                        ]
                    }, {
                        fields: { username: 1 }
                    })
                }
            }
        ]
    })
}

Meteor.methods({
    "flats.insert"(flatName) {
        check(flatName, String)

        checkUserAuthorization(this.userId)

        const flat = {
            _id: new Mongo.ObjectID(),
            flatName: flatName,
            members: [this.userId],
            invitations: []
        }

        FlatsCollection.insert(flat)

        return flat
    },

    "flats.moveOut"() {
        checkUserAuthorization(this.userId)

        const flat = getUserFlat(this.userId, "You can't move out when you're not in a flat")

        if (flat.members.length == 1) {
            // TODO: remove all data that was stored in the flat
            FlatsCollection.remove(flat._id)
        } else {
            FlatsCollection.update(flat._id,
                { $pull: { members: this.userId } }
            )
        }
    },

    "flats.inviteUser"(username) {
        check(username, String)

        checkUserAuthorization(this.userId)

        const flat = getUserFlat(this.userId, "You need to be in a flat to invite someone to")

        // At this point the client does not have enough information to continue simulating the method
        // the client is deliberatly missing information about other users
        if (this.isSimulation) {
            return
        }

        const user = Meteor.users.findOne({ username: username })
        if (!user) {
            throw new Meteor.Error("not-found", "No such user")
        }

        if (flat.members.includes(user._id)) {
            throw new Meteor.Error("invalid-operation", "User is already in the flat")
        }

        if (flat.invitations.includes(user._id)) {
            throw new Meteor.Error("invalid-operation", "User has already been invited to this flat")
        }

        FlatsCollection.update(flat._id, { $push: { invitations: user._id } })
    },

    "flats.deleteInvitation"(userId) {
        check(userId, String)

        checkUserAuthorization(this.userId)

        const flat = getUserFlat(this.userId, "You need to be in a flat to delete invitations from")

        FlatsCollection.update(flat._id, {
            $pull: { invitations: userId }
        })
    },

    "flats.join"(flatId) {
        check(flatId, Mongo.ObjectID)

        checkUserAuthorization(this.userId)

        const flat = FlatsCollection.findOne(flatId)

        if (!flat.invitations.includes(this.userId)) {
            throw new Meteor.Error("not-authorized", "You need to be invited to join a flat")
        }

        FlatsCollection.update(flatId, {
            $pull: { invitations: this.userId },
            $push: { members: this.userId }
        })
    }
})

export function getUserFlat(userId, errorText) {
    const flat = findUserFlat(userId)
    if (!flat) {
        throw new Meteor.Error("not-found", errorText)
    }

    return flat
}

export function findUserFlat(userId) {
    return FlatsCollection.findOne({ members: { $elemMatch: { $eq: userId } } })
}