import { Meteor } from "meteor/meteor"
import { check } from "meteor/check"
import { Mongo } from "meteor/mongo"
import { publishComposite } from "meteor/reywood:publish-composite"

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
                    { ownerId: this.userId },
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
                            { _id: flat.ownerId },
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

        if (!this.userId) {
            throw new Meteor.Error("not-authorized")
        }

        const flat = {
            _id: new Mongo.ObjectID(),
            ownerId: this.userId,
            flatName: flatName,
            invitations: [],
            members: []
        }

        FlatsCollection.insert(flat)

        return flat
    },
    "flats.moveOut"() {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized")
        }

        const flatAsOwner = FlatsCollection.findOne({ ownerId: this.userId })
        if (flatAsOwner) {
            const members = flatAsOwner.members

            if (flatAsOwner.members.length > 0) {
                const newOwner = members[0]
                const newMembers = members.slice(1, members.length)

                FlatsCollection.update(flatAsOwner._id, {
                    ownerId: newOwner,
                    members: newMembers
                })
            } else {
                // TODO: remove all data that was stored in the flat
                FlatsCollection.remove(flatAsOwner._id)
            }
        } else {
            // can only be member of a flat, in this case just remove the member:
            FlatsCollection.update(
                { members: { $elemMatch: { $eq: this.userId } } },
                { $pull: { members: this.userId } }
            )
        }

    },
    "flats.inviteUser"(username) {
        check(username, String)

        if (!this.userId) {
            throw new Meteor.Error("not-authorized")
        }

        // At this point the client does not have enough information to continue simulating the method
        // the client is deliberatly missing information about other users
        if (this.isSimulation) {
            return
        }

        const user = Meteor.users.findOne({ username: username })
        if (!user) {
            throw new Meteor.Error("not-found", "No such user")
        }

        const flat = FlatsCollection.findOne({ ownerId: this.userId })
        if (!flat) {
            throw new Meteor.Error("not-authorized", "Only the owner is allowed to invite")
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

        if (!this.userId) {
            throw new Meteor.Error("not-authorized")
        }

        const flat = FlatsCollection.findOne({ ownerId: this.userId })
        if (!flat) {
            throw new Meteor.Error("not-authorized", "Only the owner is allowed to delete invitations")
        }

        FlatsCollection.update(flat._id, {
            $pull: { invitations: userId }
        })
    },
    "flats.join"(flatId) {
        check(flatId, Mongo.ObjectID)

        if (!this.userId) {
            throw new Meteor.Error("not-authorized")
        }

        const flat = FlatsCollection.findOne(flatId)
        if (!flat) {
            throw new Meteor.Error("not-found")
        }

        if (!flat.invitations.includes(this.userId)) {
            throw new Meteor.Error("not-authorized", "You need to be invited to join a flat")
        }

        FlatsCollection.update(flatId, {
            $pull: { invitations: this.userId },
            $push: { members: this.userId }
        })
    }
})
