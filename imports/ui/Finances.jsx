import React, { Component } from "react"

import { Meteor } from "meteor/meteor"

import { findUserById } from "../api/Common"

import withStyles from "material-ui/styles/withStyles"
import Portal from "material-ui/Portal/Portal"
import Zoom from "material-ui/transitions/Zoom"
import Button from "material-ui/Button/Button"
import Typography from "material-ui/Typography/Typography"

import AddIcon from "material-ui-icons/Add"

import { theme, styles } from "./Theme"
import Dialog from "material-ui/Dialog/Dialog";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import DialogContent from "material-ui/Dialog/DialogContent";
import TextField from "material-ui/TextField/TextField";
import DialogActions from "material-ui/Dialog/DialogActions";

import NumberFormat from "react-number-format"
import InputAdornment from "material-ui/Input/InputAdornment";
import DialogContentText from "material-ui/Dialog/DialogContentText";
import ListSubheader from "material-ui/List/ListSubheader";
import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction";
import { UserAvatar, EurText } from "./Common";
import Checkbox from "material-ui/Checkbox/Checkbox";
import List from "material-ui/List/List";
import Immutable from "immutable"
import { DatePicker } from 'material-ui-pickers'
import moment from "moment/moment"
import ExpansionPanel from "material-ui/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "material-ui/ExpansionPanel/ExpansionPanelSummary";
import ExpandMoreIcon from "material-ui-icons/ExpandMore"
import ExpansionPanelDetails from "material-ui/ExpansionPanel/ExpansionPanelDetails";

import { withTracker } from "meteor/react-meteor-data"
import { FinancesCollection } from "../api/FinancesCollection"

class Finances extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentlyAddingPayment: false
        }
    }

    render() {
        const { currentFlat, relatedUsers, currentUser, finances, fabContainer, visible, theme, classes } = this.props

        return (
            <Typography component="div" className={classes.padded + " " + classes.centerContainer}>
                <Ledger
                    finances={finances}
                    currentUser={currentUser}
                    relatedUsers={relatedUsers}
                    classes={classes}
                />
                <AddPaymentDialog 
                    classes={classes}
                    open={this.state.currentlyAddingPayment} 
                    onClose={() => this.setState({ currentlyAddingPayment: false })}
                    currentFlat={currentFlat}
                    currentUser={currentUser}
                    relatedUsers={relatedUsers}
                />
                <Portal container={fabContainer}>
                    <Zoom
                        appear={false}
                        in={visible}
                        timeout={theme.transitions.duration.enteringScreen}
                        enterDelay={theme.transitions.duration.leavingScreen}
                        ref={(node) => { this.fabContainer = node }}
                        unmountOnExit
                    >
                        <Button 
                            fab 
                            raised
                            className={classes.bottomRightFab} 
                            color="accent"
                            onClick={(event) => this.startAddingPayment(event)}>
                            <AddIcon />
                        </Button>
                    </Zoom>
                </Portal>
            </Typography>
        )
    }

    startAddingPayment(event) {
        event.preventDefault()

        this.setState({
            currentlyAddingPayment: true
        })
    }
}

class Ledger extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { finances, currentUser, relatedUsers, classes } = this.props

        return (
            <div className={classes.grow + " " + classes.content}>
                {
                    finances.map(entry => {
                        const spender = findUserById(entry.spenderId, relatedUsers)
                        return (
                            <ExpansionPanel
                                key={entry._id}
                            >
                                <ExpansionPanelSummary 
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <div className={classes.financeEntrySummary}>
                                        <span>
                                            <UserAvatar user={spender} className={classes.smallAvatar}/>
                                            {spender.username}
                                        </span>
                                        <span>{entry.description}</span>
                                        <EurText amount={entry.amount} className={classes.financeEntryAmount}/>
                                        {
                                            entry.sharedWithIds.includes(currentUser._id)
                                                ? <EurText prefix="-" amount={entry.amount / (entry.sharedWithIds.length + 1)} className={classes.financeEntryDown} />
                                                : 
                                            entry.spenderId === currentUser._id
                                                ? <EurText prefix="+" amount={entry.amount / (entry.sharedWithIds.length + 1)} className={classes.financeEntryUp} />
                                                : ""
                                        }
                                    </div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <List dense subheader={<ListSubheader>Payment by</ListSubheader>}>
                                        <ListItem>
                                            <UserAvatar user={spender} />
                                            <ListItemText primary={spender.username} />
                                        </ListItem>
                                    </List>
                                    <List dense subheader={<ListSubheader>Shared payment amongst</ListSubheader>}>
                                        {
                                            entry.sharedWithIds.map(sharedWithId => {
                                                const user = findUserById(sharedWithId, relatedUsers)
                                                return (
                                                    <ListItem
                                                        key={sharedWithId}
                                                    >
                                                        <UserAvatar user={user} />
                                                        <ListItemText primary={user.username} secondary={"balance -sth.00€"} />
                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })
                }
            </div>
        )
    }
}


class AddPaymentDialog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            paymentText: "",
            amountText: "",
            paymentDate: moment(),
            sharedWith: this.everyoneElse(),
            errorText: undefined
        }
    }

    everyoneElse() {
        let everyoneElse = {}
        this.props.currentFlat.members.forEach(memberId => {
            if (memberId !== this.props.currentUser._id) {
                everyoneElse[memberId] = true
            }
        })
        return Immutable.Map(everyoneElse)
    }

    render() {
        const { open, currentFlat, relatedUsers, currentUser, classes } = this.props

        return (
            <Dialog
                open={open}
                onClose={() => this.closeDialog()}
                >
                <DialogTitle>Log a payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* TODO: Write some actually useful text here */}
                        Adding a payment to the log will split the cost of this payment evenly
                        between the flatmates you shared it with and yourself.
                    </DialogContentText>
                    <TextField
                        label="What was paid for"
                        fullWidth
                        autoFocus
                        required
                        value={this.state.paymentText}
                        onChange={e => this.setState({ paymentText: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        className={classes.padded}
                        label="Amount"
                        required
                        placeholder="0,00"
                        value={this.state.amountText}
                        onChange={(e) => this.setState({ amountText: e.target.value })}
                        InputProps={{
                            inputComponent: EuroAmountInput,
                            endAdornment: <InputAdornment position="end">€</InputAdornment>
                        }}
                        inputProps={{
                            onChangeAsNumber: number => this.setState({ amountNumber: number })
                        }}
                        onKeyPress={event => this.addOnEnterKey(event)}
                    />
                    <DatePicker
                        className={classes.padded}
                        value={this.state.paymentDate}
                        onChange={newDate => this.setState({ paymentDate: newDate })}
                        label="the date bought this"
                        margin="normal"
                        required
                        disableFuture
                    />
                    <List subheader={<ListSubheader>Flatmates you share this payment with:</ListSubheader>}>
                        {
                            currentFlat.members.filter(memberId => memberId !== currentUser._id).map(memberId => {
                                const member = findUserById(memberId, relatedUsers)
                                return (
                                    <ListItem
                                        key={memberId}
                                        button
                                        dense
                                        onClick={() => this.setState({ 
                                            sharedWith: this.state.sharedWith.set(memberId, !this.state.sharedWith.get(memberId))
                                        })}
                                    >
                                        <Checkbox 
                                            checked={this.state.sharedWith.get(memberId)}
                                            onChange={() => this.setState({
                                                sharedWith: this.state.sharedWith.set(memberId, !this.state.sharedWith.get(memberId))
                                            })}
                                        />
                                        <ListItemText primary={member.username} />
                                        <ListItemSecondaryAction>
                                            <UserAvatar user={member} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    {
                        this.state.errorText ? <Typography type="caption" color="error">{this.state.errorText}</Typography> : ""
                    }
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => this.onCancel()}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => this.onAdd()} 
                        color="accent"
                        disabled={!this.state.amountText}
                        raised>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    closeDialog() {
        this.clearState()
        this.props.onClose()
    }

    onAdd() {
        let sharedWith = []
        this.state.sharedWith.forEach((isShared, memberId) => {
            if (isShared) {
                sharedWith.push(memberId)
            }
        })

        this.addPayment({
            description: this.state.paymentText,
            amount: this.state.amountNumber,
            sharedWith: sharedWith,
            date: this.state.paymentDate.toDate()
        })
    }

    clearState() {
        this.setState({
            paymentText: "",
            amountText: "",
            paymentDate: moment(),
            sharedWith: this.everyoneElse(),
            errorText: undefined
        })
    }

    addOnEnterKey(event) {
        if (event.key === "Enter") {
            this.onAdd()
        }
    }

    addPayment(payment) {
        const paymentData = {
            flatId: this.props.currentFlat._id,
            spenderId: this.props.currentUser._id,
            sharedWithIds: payment.sharedWith,
            description: payment.description,
            amount: payment.amount,
            date: payment.date
        }

        console.log(paymentData)

        Meteor.call("finances.insert", paymentData, (error) => {
            if (error) {
                this.setState({
                    errorText: error.reason
                })
            } else {
                this.closeDialog()
            }
        })
    }
}

class EuroAmountInput extends Component {
    render() {
        return (
            <NumberFormat
                {...this.props}
                onValueChange={values => {
                    this.props.onChange({
                        target: {
                            value: values.value
                        }
                    })
                    this.props.onChangeAsNumber(values.floatValue)
                }}
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
            />
        )
    }
}

export default withTracker(props => {
    const { currentFlat } = props

    Meteor.subscribe("finances", currentFlat._id)

    const finances = FinancesCollection.find().fetch()

    return {
        finances
    }
})(withStyles(styles, { withTheme: true })(Finances))
