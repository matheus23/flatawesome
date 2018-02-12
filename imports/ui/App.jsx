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
	Meteor.subscribe("flats")

	const currentUser = Meteor.user()

	const flats = FlatsCollection.find().fetch()

	const currentFlat = flats.find((flat) => 
		flat.members.includes(currentUser._id)
	)

	const invitedFlats = flats.filter((flat) =>
		flat.invitations.includes(currentUser._id)
	)

 	// the server will only expose users we are allowed to know about to us
	const relatedUsers = Meteor.users.find().fetch()

	return {
		flats: flats,
		currentUser: currentUser,
		currentFlat: currentFlat,
		invitedFlats: invitedFlats,
		relatedUsers: relatedUsers
	}
})(withStyles(styles)(App))
