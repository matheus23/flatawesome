import React, { Component } from "react"
import ReactDOM from "react-dom"
import { withTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"

import { MuiThemeProvider } from "material-ui/styles"
import AppBar from "material-ui/AppBar/AppBar"
import Typography from "material-ui/Typography/Typography"
import Tabs from "material-ui/Tabs/Tabs"
import Tab from "material-ui/Tabs/Tab"
import Grid from "material-ui/Grid/Grid"
import withStyles from "material-ui/styles/withStyles"

import MenuIcon from "material-ui-icons/Menu"
import IconButton from "material-ui/IconButton/IconButton"

import SwipeableViews from "react-swipeable-views"

import ShoppingList from "./ShoppingList"
import Finances from "./Finances"
import SidebarInfo from "./SidebarInfo"

import { ShoppingListCollection } from "../api/ShoppingListCollection"
import { FinancesCollection } from "../api/FinancesCollection"
import { theme, styles } from "./Theme"

import Drawer from "material-ui/Drawer/Drawer"
import Stepper from "material-ui/Stepper/Stepper";
import Step from "material-ui/Stepper/Step";
import StepLabel from "material-ui/Stepper/StepLabel";
import Button from "material-ui/Button/Button";
import StepContent from "material-ui/Stepper/StepContent";
import FormGroup from "material-ui/Form/FormGroup";
import TextField from "material-ui/TextField/TextField";
import Paper from "material-ui/Paper/Paper"


class LoginPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeStep: 0,
            loginUsername: "",
            loginPassword: ""
        }
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.loginContainer}>
                <Paper
                    className={classes.content}
                >
                    <Stepper
                        orientation="vertical"
                        className={classes.content}
                        activeStep={this.state.activeStep}
                    >
                        <Step
                            label="Log in or register"
                        >
                            <StepLabel>Log in or register</StepLabel>
                            <StepContent>
                                <FormGroup>
                                    <TextField 
                                        required 
                                        label="Username" 
                                        value={this.state.loginUsername}
                                        onChange={(event) => this.setState({ loginUsername: event.target.value })}
                                    />
                                    <TextField 
                                        required 
                                        label="Password" 
                                        type="password" 
                                        value={this.state.loginPassword}
                                        onChange={(event) => this.setState({ loginPassword: event.target.value })}
                                    />

                                    <FormGroup row className={classes.loginButtons}>
                                        <Button 
                                            disabled
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            raised
                                            color="primary"
                                            onClick={() => this.login()}
                                        >
                                            Log in
                                        </Button>
                                    </FormGroup>
                                </FormGroup>
                            </StepContent>
                        </Step>
                        <Step
                            label="Create or join a flat"
                        >
                            <StepLabel>Create or join a flat</StepLabel>
                        </Step>
                        <Step
                            label="???"
                        >
                            <StepLabel>???</StepLabel>
                        </Step>
                        <Step
                            label="PROFIT"
                        >
                            <StepLabel>PROFIT</StepLabel>
                        </Step>
                    </Stepper>
                </Paper>
            </div>
        )
    }

    login() {
        Meteor.loginWithPassword(this.state.loginUsername, this.state.loginPassword)
        this.setState({
            activeStep: 1
        })
    }
}

export default withStyles(styles, { withTheme: true})(LoginPage)
