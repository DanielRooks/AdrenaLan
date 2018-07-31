import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Pixelratio,Scrollview, Dimensions, Image, ScrollView, RefreshControl} from 'react-native';
import Game from './Game.js'
const { width, height } = Dimensions.get("window");

export default class App extends React.Component {

  state = {
    gameStart: false,
  }
  render() {
    if(!this.state.gameStart){
        return (
        <View style={styles.container}>
          <Button
            onPress={() => {
              this.setState({gameStart: true});
              console.log((height - (9.2/10 * height)) / 2);
            }}
            title="Start"
          />
        </View>
      );
    } else {
      return (
        <Game/>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
