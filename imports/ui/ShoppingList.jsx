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

import { theme, styles } from "./Theme"

class ShoppingList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentlyAddingItem: false
        }
    }

    render() {
        const { theme, classes, shoppingList, fabContainer, visible } = this.props

        return (
            <div style={{ padding: theme.spacing.unit * 2 }}>
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item xs={12} className={classes.content}>
                        <Paper>
                            <AddShoppingListItemDialog 
                                open={this.state.currentlyAddingItem} 
                                onCancel={() => this.stopAddingItem()}
                                onAdd={(itemText) => this.addItem(itemText)}/>
                            <List>
                                {shoppingList.map((item) => <ShoppingListItem key={item._id} {...item}/>)}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
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
}

class ShoppingListItem extends Component {
    render() {
        const { checked, text } = this.props

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
                    primary={text}
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
        Meteor.call("shoppingList.setChecked", this.props._id, checked)
    }

    removeItem() {
        Meteor.call("shoppingList.remove", this.props._id)
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

export default withStyles(styles, { withTheme: true })(ShoppingList)
