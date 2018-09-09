import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";

export class ReportsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reports: [
				{
					id: "dasfsadfasdf",
					dateFrom: "1536475445",
					dateTo: "1536476445"
				}
			]
		};
	}

	componentDidMount() {
		fetch(`http://35.196.100.191:3000`, {
			credentials: "same-origin",
			headers: {
				"content-type": "application/json"
			}
		})
			.then(res => {
				console.log(res);
				if (!res.ok) {
					try {
						throw res.json();
					} catch (err) {}
					throw res;
				}
				return res.json();
			})
			.then(data => {
				console.log(data);
				this.setState({
					reports: data
				});
			})
			.catch(error => {
				Promise.resolve(error).then(error => {
					console.log(error);
				});
			});
	}

	render() {
		return (
			<div>
				{this.state.reports && (
					<Paper style={{ overflowX: "auto" }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>ReportID</TableCell>
									<TableCell>Time From</TableCell>
									<TableCell>Time To</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.reports.map((report, index) => {
									return (
										<TableRow
											onClick={() => {
												var win = window.open(
													`https://demo.docusign.net/restapi/v2/accounts/1703061/envelopes/${report.id}/documents/combined`,
													"_blank"
												);
												win.focus();
											}}
											style={{ cursor: "pointer" }}
											hover={true}
											key={report.id}>
											<TableCell
												style={{
													width: "40%"
												}}>
												{report.id}
											</TableCell>
											<TableCell
												style={{
													width: "30%"
												}}>
												{new Date(
													report.dateFrom
												).toDateString() +
													" at " +
													new Date(
														report.dateFrom
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit"
													})}
											</TableCell>
											<TableCell
												style={{
													width: "30%"
												}}>
												{new Date(
													report.dateTo
												).toDateString() +
													" at " +
													new Date(
														report.dateTo
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit"
													})}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</Paper>
				)}
			</div>
		);
	}
}
