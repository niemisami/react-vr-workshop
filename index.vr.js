import React from 'react';
import {
    AppRegistry,
    asset,
    StyleSheet,
    Pano,
    Text,
    View,
    VrButton,
} from 'react-vr';

import LabeledButton from './src/components/LabeledButton'

export default class reactVrWorkshop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foliApi: 'https://data.foli.fi/siri/sm/',
            stationInfo: [],
            numberOfResults: 5,
        }

        this.convertUnixTimeToDate = this.convertUnixTimeToDate.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.createResults = this.createResults.bind(this);
        this.assembleResultText = this.assembleResultText.bind(this);
    }

    convertUnixTimeToDate(unixTime) {
        var a = new Date(unixTime * 1000);
        var hour = (a.getHours() < 10 ? '0' : '') + a.getHours();
        var min = (a.getMinutes() < 10 ? '0' : '') + a.getMinutes();
        var time = hour + ':' + min;
        return time;
    }

    fetchData(stopNumber) {
        fetch(this.state.foliApi + stopNumber)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.setState((prevState) => ({ stationInfo: (res.result) }));
            }).catch((error) => {
                console.log("Api call error");
                console.log(error.message);
            })
    }

    assembleResultText(i) {
        var time = this.state.stationInfo.length > 0 ? this.convertUnixTimeToDate(this.state.stationInfo[i].expecteddeparturetime) : "";
        var destination = this.state.stationInfo.length > 0 ? this.state.stationInfo[i].destinationdisplay : "";
        var line = this.state.stationInfo.length > 0 ? this.state.stationInfo[i].lineref : "";
        return time + " " + line + " " + destination;
    }

    createResults() {
        const resultViews = [];
        for (var i = 0; i < this.state.stationInfo.length; i++) {
            if (i > this.state.numberOfResults - 1) {
                break;
            }
            resultViews.push(<Text
                style={{
                    transform: [{ translate: [1.3, 0.3, 0] }, { rotateY: -30 }],
                    backgroundColor: '#FBDC4Fef',
                    marginTop: 0.02,
                    width: 1.4,
                }}>
                {this.assembleResultText(i)}
            </Text>);

        }
        return resultViews
    }

    render() {
        return (
            <View>
                <Pano source={asset('background.jpg')} />
                <View style={{
                    transform: [{ translate: [0, 0, -1] }],
                    width: 1,
                    layoutOrigin: [0.5, 0.5],
                }}>

                    <LabeledButton
                        label="Pysäkki 1"
                        color="#FD8E6Ddf"
                        onButtonClicked={() => this.fetchData(1)} />

                    <LabeledButton
                        label="Pysäkki 69"
                        color="#DE86FAdf"
                        onButtonClicked={() => this.fetchData(69)} />

                    <LabeledButton
                        label="Pysäkki 162"
                        color="#C8F2DAdf"
                        onButtonClicked={() => this.fetchData(162)} />

                    {this.createResults()}
                </View>
            </View>
        );
    }
};

AppRegistry.registerComponent('reactVrWorkshop', () => reactVrWorkshop);
