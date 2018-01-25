import React, { Component } from "react"
import ReactDOM from "react-dom"
import { withTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"

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

import MenuIcon from "material-ui-icons/Menu"

import SwipeableViews from "react-swipeable-views"

import ShoppingList from "./ShoppingList"
import Finances from "./Finances"
import SidebarInfo from "./SidebarInfo"

import { ShoppingListCollection } from "../api/ShoppingListCollection"
import { FinancesCollection } from "../api/FinancesCollection"
import { theme, styles } from "./Theme"

import Drawer from "material-ui/Drawer/Drawer";


class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			index: 0,
			drawerOpen: false
		}

		this.fabContainer = []
	}

	render() {
		const { classes } = this.props

		return (
			<MuiThemeProvider theme={theme}>
				<Reboot />
				<AppBar position="static" className={classes.appBar}>
					<IconButton className={classes.menuButton} onClick={() => this.toggleDrawer()}>
						<MenuIcon />
					</IconButton>
					<Tabs 
						value={this.state.index} 
						onChange={(e, index) => this.setState({ index: index })}
						className={classes.tabs}
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
					className={classes.swipeableView}
				>
					<ShoppingList visible={this.state.index === 0} fabContainer={this.fabContainer[0]} shoppingList={this.props.shoppingList} />
					<Finances visible={this.state.index === 1} fabContainer={this.fabContainer[1]} finances={this.props.finances} />
				</SwipeableViews>

				<Drawer
					type="temporary"
					anchor="left"
					open={this.state.drawerOpen}
					onClose={() => this.setState({ drawerOpen: false })}
					ModalProps={{
						keepMounted: true
					}}
				>
					<SidebarInfo currentUser={this.props.currentUser} />
				</Drawer>
				
				<div ref={(node) => { this.fabContainer[0] = node; }}>
				</div>
				<div ref={(node) => { this.fabContainer[1] = node; }}>
				</div>
			</MuiThemeProvider>
		)
	}

	toggleDrawer() {
		this.setState({
			drawerOpen: !this.state.drawerOpen
		})
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
