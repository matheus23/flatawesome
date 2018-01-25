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

import SwipeableViews from "react-swipeable-views"


import ShoppingList from "./ShoppingList"
import Finances from "./Finances"
import { ShoppingListCollection } from "../api/ShoppingListCollection"
import { theme, styles } from "./Theme"


class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			index: 0
		}

		this.fabContainer = []
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Reboot />
				<AppBar position="static">
					<Tabs 
						value={this.state.index} 
						onChange={(e, index) => this.setState({ index: index })}
						centered
					>
						<Tab label="Shopping List" />
						<Tab label="Finances" />
					</Tabs>
				</AppBar>
				<SwipeableViews
					axis="x"
					index={this.state.index}
					onChangeIndex={(index) => this.setState({ index: index })}
				>
					<ShoppingList visible={this.state.index === 0} fabContainer={this.fabContainer[0]} shoppingList={this.props.shoppingList} />
					<Finances visible={this.state.index === 1} fabContainer={this.fabContainer[1]} />
				</SwipeableViews>
				
				<div ref={(node) => { this.fabContainer[0] = node; }}>
				</div>
				<div ref={(node) => { this.fabContainer[1] = node; }}>
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
