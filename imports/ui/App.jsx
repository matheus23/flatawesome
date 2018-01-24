import React, { Component } from "react"
import ReactDOM from "react-dom"
import { withTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"
import AccountsUIWrapper from "./AccountsUIWrapper"

import { MuiThemeProvider } from "material-ui/styles"
import { indigo, blueGrey } from "material-ui/colors"
import Reboot from "material-ui/Reboot/Reboot"
import AppBar from "material-ui/AppBar/AppBar"
import Typography from "material-ui/Typography/Typography"
import Toolbar from "material-ui/Toolbar/Toolbar"
import { Menu } from "material-ui-icons"
import IconButton from "material-ui/IconButton/IconButton"
import Tabs from "material-ui/Tabs/Tabs"
import Tab from "material-ui/Tabs/Tab"
import Grid from "material-ui/Grid/Grid"
import withStyles from "material-ui/styles/withStyles"

import ShoppingList from "./ShoppingList"
import { ShoppingListCollection } from "../api/ShoppingListCollection"
import { theme } from "./Theme"


const styles = theme => ({
	container: {
		"max-width": "900px"
	}
})

class App extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Reboot />
				<AppBar position="static">
					<Tabs value={0} centered>
						<Tab label="Shopping List" />
						<Tab label="Finances" />
					</Tabs>
				</AppBar>
				<div style={{ padding: theme.spacing.unit * 2 }}>
					<Grid
						container
						justify="center"
						alignItems="stretch"
					>
						<ShoppingList shoppingList={this.props.shoppingList} />
					</Grid>
				</div>
			</MuiThemeProvider>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe("shoppingList")

	return {
		shoppingList: ShoppingListCollection.find().fetch(),
		currentUser: Meteor.user()
	}
})(withStyles(styles)(App))
