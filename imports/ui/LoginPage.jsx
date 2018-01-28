import React, { Component } from "react"
import ReactDOM from "react-dom"
import { withTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"
import { Accounts } from "meteor/accounts-base"
import { Session } from "meteor/session"

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
import { FlatsCollection } from "../api/FlatsCollection"
import { theme, styles } from "./Theme"

import Drawer from "material-ui/Drawer/Drawer"
import Stepper from "material-ui/Stepper/Stepper"
import Step from "material-ui/Stepper/Step"
import StepLabel from "material-ui/Stepper/StepLabel"
import Button from "material-ui/Button/Button"
import StepContent from "material-ui/Stepper/StepContent"
import FormGroup from "material-ui/Form/FormGroup"
import TextField from "material-ui/TextField/TextField"
import Paper from "material-ui/Paper/Paper"
import Divider from "material-ui/Divider/Divider"
import List from "material-ui/List/List"
import ListItemText from "material-ui/List/ListItemText"
import ListItem from "material-ui/List/ListItem"


class LoginPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loginUsername: "",
            loginPassword: "",
            creatingAccount: false,
            repeatedPassword: "",

            flatName: ""
        }
    }

    render() {
        const { invitedFlats, relatedUsers, classes } = this.props

        return (
            <div className={classes.loginContainer + " " + classes.backgroundImage}>
                <Paper
                    className={classes.content}
                    elevation={20}
                >
                    <Typography type="display2" className={classes.flatAWESOME}>FlatAWESOME</Typography>
                    <Stepper
                        orientation="vertical"
                        className={classes.content}
                        activeStep={this.determineStep()}
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

                                    { this.state.creatingAccount
                                        ?   <TextField
                                                label="Repeat Password"
                                                type="password"
                                                error={this.state.loginPassword !== this.state.repeatedPassword}
                                                value={this.state.repeatedPassword}
                                                onChange={(event) => this.setState({ repeatedPassword: event.target.value })}
                                            />
                                        : ""
                                    }
                                    <div className={classes.askCreateAccount}>
                                        <Typography type="caption">
                                            { this.state.creatingAccount
                                                ? "Already have an account?"
                                                : "Don't have an account yet?"
                                            }
                                        </Typography>
                                        <Button
                                            onClick={() => this.setState({ creatingAccount: !this.state.creatingAccount })}
                                        >
                                            { this.state.creatingAccount
                                                ? "Go back"
                                                : "Create one"
                                            }
                                        </Button>
                                    </div>

                                    { this.state.loginError ? <Typography color="error" type="caption">{this.state.loginError}</Typography> : "" }

                                    <FormGroup row className={classes.formButtons}>
                                        <Button 
                                            disabled
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            raised
                                            color="primary"
                                            onClick={() => this.loginOrRegister()}
                                            disabled={ this.state.creatingAccount && this.state.loginPassword !== this.state.repeatedPassword }
                                        >
                                            { this.state.creatingAccount
                                                ? "Register"
                                                : "Log in"
                                            }
                                        </Button>
                                    </FormGroup>
                                </FormGroup>
                            </StepContent>
                        </Step>
                        <Step
                            label="Create or join a flat"
                        >
                            <StepLabel>Create or join a flat</StepLabel>
                            <StepContent>
                                <Typography type="headline">Create a flat</Typography>
                                <TextField
                                    required
                                    label="Flat name"
                                    value={this.state.flatName}
                                    onChange={(event) => this.setState({ flatName: event.target.value })}
                                />
                                
                                <FormGroup
                                    row 
                                    className={classes.padded}
                                >
                                    <Button
                                        raised
                                        color="primary"
                                        onClick={() => this.createFlat()}
                                    >
                                        Create
                                    </Button>
                                </FormGroup>
                                
                                <Divider />

                                <div className={classes.centerContainer}>
                                    <Typography type="caption" className={classes.centered}>or: </Typography>
                                </div>
                                <Typography type="headline">Join via an invitation: </Typography>
                                <div className={classes.centerContainer}>
                                    { invitedFlats.length > 0
                                        ? ""
                                        : <Typography type="subheading" className={classes.centered}>You have not been invited yet :(</Typography>
                                        }
                                </div>
                                <List>
                                    { invitedFlats.map((flat) => 
                                            <ListItem
                                                key={flat._id}
                                                button
                                                onClick={() => this.joinFlat(flat)}
                                            >
                                                <ListItemText primary={flat.flatName} secondary={"Invited by: " + this.getUserById(flat.ownerId).username}/>
                                            </ListItem>
                                        )
                                    }
                                </List>

                                <Divider />

                                <Button onClick={() => Accounts.logout()}>Back</Button>
                            </StepContent>
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
                    <Typography type="caption" className={classes.padded}>* Required</Typography>
                </Paper>
            </div>
        )
    }

    determineStep() {
        if (this.props.currentUser) {
            if (this.props.currentFlat) {
                return 2
            }
            return 1
        }
        return 0
    }

    loginOrRegister() {
        if (!this.state.creatingAccount) {
            Meteor.loginWithPassword(this.state.loginUsername, this.state.loginPassword, (error) => {
                this.setState({
                    loginError: error ? error.reason : undefined
                })
            })
        } else if (this.state.loginPassword === this.state.repeatedPassword) {
            Accounts.createUser({
                username: this.state.loginUsername,
                password: this.state.loginPassword
            }, (error) => {
                this.setState({
                    loginError: error ? error.reason : undefined
                })
            })
        }
    }

    createFlat() {
        if (this.state.flatName !== "") {
            Meteor.call("flats.insert", this.state.flatName, (error, flat) => {
                if (error) {
                    console.log("Flat creation error", error)
                }
                if (flat) {
                    Session.set("flat", flat)
                }
            })
        }
    }

    joinFlat(flat) {
        Meteor.call("flats.join", flat._id)
    }

    getUserById(userId) {
        return this.props.relatedUsers.find((user) => user._id === userId)
    }

}

export default withStyles(styles, { withTheme: true})(LoginPage)
