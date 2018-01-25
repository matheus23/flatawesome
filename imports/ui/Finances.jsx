import React, { Component } from "react"

import withStyles from "material-ui/styles/withStyles"
import Portal from "material-ui/Portal/Portal"
import Zoom from "material-ui/transitions/Zoom"
import Button from "material-ui/Button/Button"
import AddIcon from "material-ui-icons/Add"

import { theme, styles } from "./Theme"

class Finances extends Component {
    render() {
        const { fabContainer, visible, theme, classes } = this.props

        return (
            <div>
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
}

export default withStyles(styles, { withTheme: true })(Finances)