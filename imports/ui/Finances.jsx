import React, { Component } from "react"

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

class Finances extends Component {
    constructor(props) {
        super(props)

        console.log(props)

        this.state = {
            currentlyAddingPayment: false
        }
    }

    render() {
        const { fabContainer, visible, theme, classes } = this.props

        return (
            <Typography component="div">
                <AddPaymentDialog 
                    open={this.state.currentlyAddingPayment} 
                    onCancel={() => this.setState({ currentlyAddingPayment: false })}
                    onAdd={(payment) => this.addPayment(payment)}
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


class AddPaymentDialog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            textFieldValue: ""
        }
    }

    render() {
        const { open, onCancel, onAdd } = this.props

        return (
            <Dialog
                open={open}
                onClose={() => this.onCancel()}
                >
                <DialogTitle>Log a payment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Amount"
                        fullWidth
                        InputProps={{
                            autoFocus: true
                        }}
                        value={this.state.textFieldValue}
                        onChange={(e) => this.setState({ textFieldValue: e.target.value })}
                        />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => this.onCancel()}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => this.onAdd()} 
                        color="accent"
                        raised>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    onCancel() {
        this.clearTextField()
        this.props.onCancel()
    }

    onAdd() {
        const text = this.state.textFieldValue
        this.clearTextField()
        this.props.onAdd(text)
    }

    clearTextField() {
        this.setState({
            textFieldValue: ""
        })
    }
}

export default withStyles(styles, { withTheme: true })(Finances)