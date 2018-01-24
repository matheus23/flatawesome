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

import DeleteIcon from "material-ui-icons/Delete"
import AddIcon from "material-ui-icons/AddShoppingCart"
import Typography from "material-ui/Typography/Typography";


const styles = theme => ({
    bottomRightFab: {
        position: "absolute",
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4
    }
})

class ShoppingList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentlyAddingItem: false
        }
    }

    render() {
        const { classes, shoppingList } = this.props

        return (
            <Typography component="div">
                <AddShoppingListItemDialog 
                    open={this.state.currentlyAddingItem} 
                    onCancel={() => this.stopAddingItem()}
                    onAdd={(itemText) => this.addItem(itemText)}/>
                <List>
                    {shoppingList.map((item) => <ShoppingListItem key={item._id} {...item}/>)}
                </List>
                <Button 
                    fab 
                    raised
                    className={classes.bottomRightFab} 
                    color="accent"
                    onClick={(event) => this.startAddingItem(event)}>
                    <AddIcon />
                </Button>
            </Typography>
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

export default withStyles(styles, { withTheme: true })(ShoppingList)
