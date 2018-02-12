import React, { Component } from "react"
import { Meteor } from "meteor/meteor"

import List from "material-ui/List/List"
import ListItem from "material-ui/List/ListItem"
import Checkbox from "material-ui/Checkbox/Checkbox"
import ListItemText from "material-ui/List/ListItemText"
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction"
import Button from "material-ui/Button/Button"
import Zoom from "material-ui/transitions/Zoom"
import withStyles from "material-ui/styles/withStyles"
import TextField from "material-ui/TextField/TextField"
import Dialog from "material-ui/Dialog/Dialog"
import DialogTitle from "material-ui/Dialog/DialogTitle"
import DialogContent from "material-ui/Dialog/DialogContent"
import DialogActions from "material-ui/Dialog/DialogActions"
import IconButton from "material-ui/IconButton/IconButton"
import Typography from "material-ui/Typography/Typography"
import Grid from "material-ui/Grid/Grid"
import Paper from "material-ui/Paper/Paper"
import Portal from "material-ui/Portal/Portal"

import DeleteIcon from "material-ui-icons/Delete"
import AddIcon from "material-ui-icons/AddShoppingCart"
import CloseIcon from "material-ui-icons/Close"

import TimeAgo from "react-timeago"

import { theme, styles } from "./Theme"
import Snackbar from "material-ui/Snackbar/Snackbar"

import { withTracker } from "meteor/react-meteor-data"
import { ShoppingListCollection } from "../api/ShoppingListCollection"

class ShoppingList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentlyAddingItem: false,
            snackbarOpen: false,
            lastClearedItems: []
        }
    }

    render() {
        const { theme, classes, shoppingList, fabContainer, visible } = this.props

        return (
            <div className={classes.padded + " " + classes.centerContainer}>
                <div className={classes.grow + " " + classes.content}>
                    <Paper>
                        <AddShoppingListItemDialog 
                            open={this.state.currentlyAddingItem} 
                            onCancel={() => this.stopAddingItem()}
                            onAdd={(itemText) => this.addItem(itemText)}/>
                        <List>
                            {
                                shoppingList.map(item => 
                                    <ShoppingListItem 
                                        key={item._id} 
                                        classes={classes} 
                                        onRemove={item => this.openSnackbarWithUndoable([item])}
                                        item={item}
                                    />
                                )
                            }
                        </List>
                    </Paper>
                    <Button
                        fullWidth
                        className={classes.padded}
                        onClick={() => this.clearChecked()}
                    >
                        Remove all checked items
                    </Button>
                </div>

                <Snackbar
                    className={classes.snackbar}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => this.onSnackbarClose(false)}
                    message="Item(s) removed"
                    action={[
                        <Button key="undo" color="primary" dense onClick={() => this.onSnackbarClose(true)}>
                        Undo
                        </Button>,
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={() => this.onSnackbarClose(false)}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />

                <Portal container={fabContainer}>
                    <Zoom
                        appear={false}
                        in={visible}
                        timeout={theme.transitions.duration.enteringScreen}
                        enterDelay={theme.transitions.duration.leavingScreen}
                        ref={(node) => { this.fabContainer = node; }}
                        unmountOnExit
                    >
                        <Button 
                            fab 
                            raised
                            className={classes.bottomRightFab} 
                            color="accent"
                            onClick={(event) => this.startAddingItem(event)}>
                            <AddIcon />
                        </Button>
                    </Zoom>
                </Portal>
            </div>
        )
    }

    startAddingItem(event) {
        event.preventDefault()
        this.setState({
            currentlyAddingItem: true
        })
    }

    stopAddingItem() {
        this.setState({
            currentlyAddingItem: false
        })
    }

    addItem(itemText) {
        this.stopAddingItem()
        Meteor.call("shoppingList.insert", itemText)
    }

    clearChecked() {
        Meteor.call("shoppingList.clearChecked", (error, result) => {
            if (result) {
                this.openSnackbarWithUndoable(result)
            }
        })
    }

    onSnackbarClose(undo) {
        if (undo) {
            Meteor.call("shoppingList.insertAll", this.state.lastClearedItems, (error, result) => {
                if (!error) {
                    this.setState({
                        snackbarOpen: false,
                        lastClearedItems: []
                    })
                }
            })
        } else {
            this.setState({
                snackbarOpen: false,
                lastClearedItems: []
            })
        }
    }

    openSnackbarWithUndoable(undoableItems) {
        this.setState({ 
            snackbarOpen: true,
            lastClearedItems: undoableItems
        })
    }
}

class ShoppingListItem extends Component {
    render() {
        const { item, classes } = this.props

        const { checked, text, createdAt } = item

        return (
            <ListItem
                button
                onClick={() => this.setChecked(!checked)}
                >
                <Checkbox 
                    checked={checked} 
                    onChange={(event, newChecked) => { event.preventDefault(); this.setChecked(newChecked) }}
                    />
                <ListItemText 
                    primary={<Typography className={checked ? classes.checkedItem : ""}>{text}</Typography>}
                    secondary={<TimeAgo date={createdAt} />}
                    />
                <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeItem()}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    setChecked(checked) {
        Meteor.call("shoppingList.setChecked", this.props.item._id, checked)
    }

    removeItem() {
        Meteor.call("shoppingList.remove", this.props.item._id)
        this.props.onRemove(this.props.item)
    }
}

class AddShoppingListItemDialog extends Component {
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
                <DialogTitle>Add a shopping list item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Shopping list item"
                        fullWidth
                        autoFocus
                        onKeyDown={(e) => this.onKeyDown(e)}
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

    onKeyDown(event) {
        if (event.key === "Enter") {
            this.onAdd()
        }
    }
}

export default ShoppingListContainer = withTracker(props => {
    const { currentFlat } = props

    Meteor.subscribe("shoppingList", currentFlat._id)

    const shoppingList = ShoppingListCollection.find().fetch()

    return {
        currentFlat,
        shoppingList
    }
})
(withStyles(styles, { withTheme: true })(ShoppingList))
