import React from "react";

import "../styles/DashboardLayout.scss";
import DataDisplay from "./DataDisplay";
import {
    Divider,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup
} from "@material-ui/core";
import FeedService from "../services/FeedService";

const vocIds = {
    braddock: "26443",
    clairton: "26445",
    mckeesport: "26452"
};

export default class DashboardLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            requestInterval: null,
            showError: false,
            targetVOC: "braddock",
            VOCData: null
        };

        this.makeDataRequest = this.makeDataRequest.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
    }

    componentDidMount() {
        // Make initial request, then auto update afterwards
        this.makeDataRequest();

        // update data every 10 minutes
        // refreshInterval = desired mins * 60s/1m * 1000ms/1s = desired minutes in ms
        const refreshInterval = 10 * 60 * 1000;
        const requestInterval = setInterval(() => {
            this.makeDataRequest();
        }, refreshInterval);
        this.setState({ requestInterval });
    }

    componentWillUnmount() {
        clearInterval(this.state.requestInterval);
    }

    makeDataRequest() {
        const { targetVOC } = this.state;
        const dataPromise = FeedService.getData(vocIds[targetVOC]).then(
            response => {
                if (response.status && response.status === "success") {
                    this.setState({ VOCData: response.data });
                } else {
                    this.setState({ showError: true });
                }
            }
        );
    }

    onRadioChange(event) {
        this.setState(
            {
                targetVOC: event.target.value
            },
            () => {
                setTimeout(this.makeDataRequest(), 0);
            }
        );
    }

    render() {
        const { showError, targetVOC, VOCData } = this.state;

        return (
            <div className="layout">
                <h1>Monitor Dashboard</h1>
                <Paper className="dashboard-background">
                    <RadioGroup
                        onChange={this.onRadioChange}
                        row={true}
                        value={targetVOC}
                    >
                        <FormControlLabel
                            value="braddock"
                            className="radio-control"
                            control={<Radio />}
                            labelPlacement="top"
                            label="Braddock"
                        />
                        <FormControlLabel
                            value="clairton"
                            control={<Radio />}
                            labelPlacement="top"
                            label="Clairton North"
                        />
                        <FormControlLabel
                            value="mckeesport"
                            control={<Radio />}
                            labelPlacement="top"
                            label="Mckeesport"
                        />
                    </RadioGroup>
                    <Divider className="divider" variant="middle" />
                    {showError && (
                        <div className="error">
                            <h2>
                                Unable to connect to feed. <br /> Choose another
                                monitor or refresh.
                            </h2>
                        </div>
                    )}
                    <DataDisplay
                        refresh={this.makeDataRequest}
                        VOCData={VOCData}
                    />
                </Paper>
            </div>
        );
    }
}
