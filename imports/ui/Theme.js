import { createMuiTheme } from "material-ui/styles"
import red from "material-ui/colors/red"
import green from "material-ui/colors/green";

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
	flatAWESOME: {
		padding: theme.spacing.unit * 4
	},
	backgroundImage: {
		backgroundImage: "url('loft.jpg')",
		height: "100%", 
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
	},
	swipeableView: {
		height: "100%"
	},

	appBar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	menuButton: {
		marginLeft: theme.spacing.unit,
		padding: theme.spacing.unit
	},
	grow: {
		width: "100%",
		flexGrow: 1
	},

    bottomRightFab: {
        position: "fixed",
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4
    },
	snackbar: {
		position: "fixed",
		bottom: theme.spacing.unit * 2
	},
    content: {
        maxWidth: 900
	},

	sidebar: {
		width: 300
	},

	checkedItem: {
		textDecoration: "line-through",
		color: theme.palette.grey[500]
	},

    loginContainer: {
        display: "flex",
        justifyContent: "center",
		alignItems: "center",
	},
	padded: {
		padding: theme.spacing.unit * 2
	},
	askCreateAccount: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	creatingAccount: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},

	centerContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	center: {
	},
	dangerButton: {
		color: theme.palette.common.white,
		backgroundColor: red[500]
	},

	smallAvatar: {
		width: 30,
		height: 30
	},

	financeEntrySummary: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%"
	},
	financeEntryAmount: {
		fontWeight: "bold"
	},
	financeEntryDown: {
		color: red[500]
	},
	financeEntryUp: {
		color: green[500]
	}
})
