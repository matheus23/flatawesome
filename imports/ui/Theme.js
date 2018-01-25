import { createMuiTheme } from "material-ui/styles"

export const theme = createMuiTheme({
	palette: {
		primary: {
			light: "#bef67a",
			main: "#8bc34a",
			dark: "#5a9216",
			contrastText: "#3e2723"
		},
		secondary: {
			light: "#a98274",
			main: "#795548",
			dark: "#4b2c20",
			contrastText: "#ffffff"
		}
	},
	spacing: {
		unit: 6
	}
})

export const styles = theme => ({
	root: {
		height: "100%"
	},
	swipeableView: {
		height: "100%"
	},

	appBar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyConten: "space-between"
	},
	menuButton: {
		marginLeft: theme.spacing.unit,
		padding: theme.spacing.unit
	},
	tabs: {
		flexGrow: 1
	},

    bottomRightFab: {
        position: "fixed",
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4
    },
    content: {
        "max-width": "900px"
	},

	sidebar: {
		width: 300
	}
})
