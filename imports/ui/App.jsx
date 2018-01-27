import React, { Component } from "react"
import ReactDOM from "react-dom"
import { withTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"
import { Session } from "meteor/session"

import { MuiThemeProvider } from "material-ui/styles"
import Reboot from "material-ui/Reboot/Reboot"
import withStyles from "material-ui/styles/withStyles"

import Flatawesome from "./Flatawesome"
import LoginPage from "./LoginPage"

import { ShoppingListCollection } from "../api/ShoppingListCollection"
import { FinancesCollection } from "../api/FinancesCollection"
import { FlatsCollection } from "../api/FlatsCollection"
import { theme, styles } from "./Theme"


class App extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Reboot />
				{ this.props.currentUser && this.props.currentFlat
					? <Flatawesome {...this.props} />
					: <LoginPage {...this.props} />
				}
			</MuiThemeProvider>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe("shoppingList")
	Meteor.subscribe("finances")
	Meteor.subscribe("flats")

	const flats = FlatsCollection.find().fetch()
	const shoppingList = ShoppingListCollection.find().fetch()

	const currentUser = Meteor.user()

	const foundFlat = flats.find((flat) => 
		flat.ownerId === currentUser._id || 
		flat.members.includes(currentUser._id)
	)

	const currentFlat = foundFlat 
		? Object.assign({}, foundFlat, { owner: Meteor.users.find(foundFlat.ownerId).fetch().username })
		: undefined

	const invitedFlats = flats.filter((flat) =>
		flat.invitations.includes(currentUser._id)
	)

	console.log(invitedFlats)

	return {
		shoppingList: shoppingList,
		finances: FinancesCollection.find().fetch(),
		flats: flats,
		currentUser: currentUser,
		currentFlat: currentFlat,
		invitedFlats: invitedFlats
	}
})(withStyles(styles)(App))
