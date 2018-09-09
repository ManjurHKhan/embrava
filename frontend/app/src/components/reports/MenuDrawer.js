import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ViewListIcon from "@material-ui/icons/ViewList";
import {ReportsTable} from "./ReportsTable";

const drawerWidth = 200;

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "100%",
		zIndex: 1,
		overflow: "hidden",
		position: "relative",
		display: "flex"
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 36
	},
	hide: {
		display: "none"
	},
	drawerPaper: {
		height: "100%",
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerPaperClose: {
		overflowX: "hidden",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		width: 60
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: "0 8px",
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		overflowX: "auto"
	},
	selected: {
		backgroundColor: "#01579B !important",
		"& $primary, & $icon": {
			color: theme.palette.common.white
		}
	},
	docked: {
		minHeight: "100vh !important"
	},
	primary: {},
	icon: {}
});

class MiniDrawer extends React.Component {
	state = {
		open: false
	};
	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { classes, theme } = this.props;

		return (
			<div className={classes.root}>
				<AppBar
					position="fixed"
					style={{ backgroundColor: "#01579B", paddingLeft: 0 }}
					className={classNames(
						classes.appBar,
						this.state.open && classes.appBarShift
					)}>
					<Toolbar disableGutters={!this.state.open}>
						<IconButton
							color="inherit"
							onClick={this.handleDrawerOpen}
							className={classNames(
								classes.menuButton,
								this.state.open && classes.hide
							)}>
							<MenuIcon />
						</IconButton>
						<Typography
							variant="title"
							color="inherit"
							noWrap
							style={{ flex: 1 }}>
							Reports
						</Typography>
						<Button
							id="logout"
							href="/logout"
							color="inherit"
							style={{ marginRight: 10 }}>
							Sign Out
						</Button>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					classes={{
						paper: classNames(
							classes.drawerPaper,
							classes.docked,
							!this.state.open && classes.drawerPaperClose
						)
					}}
					open={this.state.open}>
					<div
						className={classes.toolbar}
						style={{ position: "fixed", left: 140 }}>
						<IconButton onClick={this.handleDrawerClose}>
							{theme.direction === "rtl" ? (
								<ChevronRightIcon />
							) : (
								<ChevronLeftIcon />
							)}
						</IconButton>
					</div>
					<div
						style={{
							position: "fixed",
							top: 63,
							width: this.state.open ? 200 : 60
						}}>
						<Divider />
						<div style={{ paddingTop: 37 }} />
						<MenuList component="nav">
							<MenuItem
								selected={
									window.location.pathname.includes("reports")
										? true
										: false
								}
								style={{ paddingLeft: 17 }}
								classes={{ selected: classes.selected }}
								onClick={() => (location = "/reports")}>
								<ListItemIcon className={classes.icon}>
									<ViewListIcon />
								</ListItemIcon>
								{this.state.open && (
									<ListItemText
										classes={{
											primary: classes.primary
										}}
										primary="Reports"
									/>
								)}
							</MenuItem>
							<Divider />
						</MenuList>
					</div>
				</Drawer>
				<main className={classes.content}>
					<div className={classes.toolbar}/>
						<ReportsTable />
				</main>
			</div>
		);
	}
}

MiniDrawer.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);
