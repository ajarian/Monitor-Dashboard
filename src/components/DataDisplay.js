import React from "react";

import "../styles/DataIndicator.scss";
import format from "date-fns/format";
import RefreshRoundedIcon from "@material-ui/icons/RefreshRounded";

export default class DataDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataPoints: null,
            lastUpdateTime: "N/A",
            VOCData: null
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.VOCData !== this.props.VOCData) {
            this.setState(
                { dataPoints: null, VOCData: this.props.VOCData },
                () => {
                    setTimeout(this.createDataIndicators(), 0);
                }
            );
        }
    }

    createDataIndicators() {
        const fieldsToDisplay = ["eCO2", "humidity", "temp", "tVOC"];
        const { VOCData } = this.state;
        let indicators = [];

        for (const field of fieldsToDisplay) {
            const channelData = VOCData.channelBounds.channels[field];
            indicators.push(
                <div className="indicator-field" key={field}>
                    <div className="field-name">{field}</div>
                    <div>
                        <div className="max">Max</div>
                        <span className="value">{channelData.maxValue}</span>
                        <div className="min">Min</div>
                        <span className="value">{channelData.minValue}</span>
                    </div>
                </div>
            );
        }

        this.setState({
            indicators,
            lastUpdateTime: format(new Date(), "h:mm:ss aa")
        });
    }

    render() {
        const { indicators, lastUpdateTime } = this.state;

        return (
            <div className="indicator-layout">
                <div className="voc-data">{indicators}</div>
                <div className="update-area">
                    Last Updated {lastUpdateTime}
                    <RefreshRoundedIcon
                        className="refresh"
                        onClick={() => {
                            this.props.refresh();
                        }}
                    />
                </div>
            </div>
        );
    }
}
