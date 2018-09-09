import React from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

export class SignInForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			insurance: "",
			provider: "",
			email: "",
			flag: true
		};
		this.submit = this.submit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		if (event.target.id == "name") {
			this.setState({ name: event.target.value });
		} else if (event.target.id == "insurance") {
			this.setState({ insurance: event.target.value });
		} else if (event.target.id == "provider") {
			this.setState({ provider: event.target.value });
		} else if (event.target.id == "email") {
			this.setState({ email: event.target.value });
		}
	}

	submit(e) {
		e.preventDefault();
		$.post({
			url: "http://35.196.100.191:3000/agreement",
			type: "POST",
			data: JSON.stringify({
				name: this.state.name,
				insuranceCompany: this.state.insurance,
				employer: this.state.provider,
				email: this.state.email
			}),
			dataType: "text",
			contentType: "application/json; charset=utf-8",
			success: function(data) {
				console.log(data);
			}.bind(this)
		});
		this.setState({ flag: false });
	}

	render() {
		return (
			<div
				style={{
					display: "flex",
					outline: "none",
					position: "relative",
					overflowY: "auto",
					top: -75,
					left: 0,
					right: 0,
					bottom: 0,
					position: "fixed",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}>
				<Paper
					style={{
						width: "400",
						flexDirection: "column",
						flex: "0 1 auto",
						maxHeight: "calc(100% - 96px)",
						margin: 48,
						paddingBottom: 30,
						overflowY: "auto"
					}}>
					<div style={style.logoStyle}>endrava</div>
					{this.state.flag ? (
						<form
							onSubmit={e => this.submit(e)}
							style={{
								width: 400,
								margin: "0 auto",
								padding: 30
							}}>
							<TextField
								fullWidth
								id="name"
								style={{ paddingBottom: 20 }}
								label={"Name"}
								value={this.state.name}
								placeholder={"Name"}
								onChange={this.handleChange}
								InputLabelProps={{
									shrink: true
								}}
							/>
							<TextField
								fullWidth
								id="email"
								style={{ paddingBottom: 20 }}
								label={"Email"}
								value={this.state.email}
								placeholder={"Email"}
								onChange={this.handleChange}
								InputLabelProps={{
									shrink: true
								}}
							/>
							<TextField
								id="insurance"
								fullWidth
								style={{ paddingBottom: 20 }}
								label={"Insurance Provider"}
								value={this.state.insurance}
								placeholder={"Insurance Provider"}
								onChange={this.handleChange}
								InputLabelProps={{
									shrink: true
								}}
							/>
							<TextField
								id="provider"
								fullWidth
								style={{ paddingBottom: 60 }}
								label={"Employer"}
								value={this.state.employer}
								placeholder={"Employer"}
								onChange={this.handleChange}
								InputLabelProps={{
									shrink: true
								}}
							/>
							<div className="index-button-style">
								<Button
									style={{ marginLeft: 119 }}
									type="submit"
									variant="raised"
									className="button-style">
									Submit
								</Button>
							</div>
						</form>
					) : (
						<div style={{ padding: 40 }}>
						Endrrrava! Check your email for agreement
						</div>
					)}
				</Paper>
			</div>
		);
	}
}

var style = {
	logoStyle: {
		color: "#01579B",
		fontSize: "36px",
		padding: "60px 30px 30px 40px"
	}
};
