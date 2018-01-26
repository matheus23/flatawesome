import React, { Component } from "react"
import ReactDOM from "react-dom"
import { withTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"

import { MuiThemeProvider } from "material-ui/styles"
import Reboot from "material-ui/Reboot/Reboot"
import withStyles from "material-ui/styles/withStyles"

import Flatawesome from "./Flatawesome"
import LoginPage from "./LoginPage"

import { ShoppingListCollection } from "../api/ShoppingListCollection"
import { FinancesCollection } from "../api/FinancesCollection"
import { theme, styles } from "./Theme"


class App extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Reboot />
				{ this.props.currentUser 
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

	return {
		shoppingList: ShoppingListCollection.find().fetch(),
		finances: FinancesCollection.find().fetch(),
		currentUser: Meteor.user()
	}
})(withStyles(styles)(App))
