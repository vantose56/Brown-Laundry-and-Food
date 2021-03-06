import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  PushNotificationIOS,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyMachinesDisplay from './MyMachinesDisplay';

export default class MyMachines extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            machines: [],
            unseen: "",
            loading: true,
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        const { navigate } = navigation;
        return {
            title: 'My Machines',
            headerTintColor: '#BDB9B7',
            headerStyle: {
                backgroundColor: '#1E130C',
            },
            headerBackTitle: 'Rooms',
        }
    };

    static _interval;

    componentWillMount() {
        this._interval = setInterval(() => {
            this.setState(() => {
                PushNotificationIOS.getScheduledLocalNotifications( (test) => this.organizeMachines(test));
                return { unseen: "does not display"}
            });
        }, 1*1000);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    organizeMachines(machines) {
        let washers = [];
        let dryers = [];
        for (var i = 0; i < machines.length; i++) {
            if (machines[i]["userInfo"]["type"] == "washer") {
                washers.push(machines[i]);
            } else {
                dryers.push(machines[i]);
            }
        }
        let both = washers.concat(dryers);
        this.setState({machines: both});
        this.setState({loading: false});
    }


    render() {
        if (this.state.loading) {
            return (
                <LinearGradient colors={['#9A8478', '#1E130C']} locations={[0,0.55]} style={styles.background}>
                    <ActivityIndicator size="large" color="#9A8478"/>
                </LinearGradient>
            );
        } else if (this.state.machines.length == 0){
            return (
                <LinearGradient colors={['#9A8478', '#1E130C']} locations={[0,0.55]} style={styles.background}>
                    <View style={styles.error}>
                        <Image style={{marginLeft: 10}} source={require('../img/noMachines.png')}/>
                        <Text style={styles.noMachines}>You have no machines running</Text>
                    </View>
                </LinearGradient>
            );
        } else {
            return (
                <LinearGradient colors={['#9A8478', '#1E130C']} locations={[0,0.55]} style={styles.background}>
                    <MyMachinesDisplay machines={this.state.machines} />
                </LinearGradient>
            );
        }

    }
}


const styles = StyleSheet.create({
  label: {
    fontSize: 17,
    textAlign: 'center',
    color: '#BDB9B7',
    backgroundColor: 'transparent',
  },
  background: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#F5FCFF',
  },
  error: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    paddingBottom: 100,
  },
  noMachines: {
    color: "#BDB9B7",
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingTop: 10,
  }
});
