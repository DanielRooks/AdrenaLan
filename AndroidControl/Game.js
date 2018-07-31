import React, { Component } from 'react';
import { TouchableHighlight, View, StyleSheet, Text, Scrollview, Dimensions, Image, ScrollView, RefreshControl} from 'react-native';
import { Client, Message } from 'react-native-paho-mqtt';

const { width, height } = Dimensions.get("window");
const w = 0.72 * width;
const h = 0.9 * height;
const t = (height - h) / 2;
const l = (width - w) / 2;
var x = 50;
var y = 50;
var ptx = 50;
var pty = 50 ;
var orient = 0;
var directions = "";
var started = false;
const wb = 40;
var arr = [];
var lastmsg = "";
for(var i = 0; i <= 318; i++) {
	arr.push('white');
}
const arena = (h, w, t ,l) => ({
	position: "absolute",
	height:h,
	width: w,
	marginVertical: t,
	marginHorizontal: l,
	backgroundColor: "black",
})

const bot = (w, x, y) => ({
	position:'absolute',
	height: w,
	width: w,
	top: x,
	left: y,
	borderRadius: w/2,
	backgroundColor: 'red',
	margin: 1,
})
const left = (h, w, x, y) => ({
	position:"absolute",
	height: h,
	width: w,
	top: x,
	left: y - (w),
	backgroundColor:"white",
})

const down = (h, w, x, y) => ({
	position:"absolute",
	height: h,
	width: w,
	top: x + h + 1,
	left: y,
	backgroundColor:"white",
})

const up = (h, w, x, y) => ({
	position:"absolute",
	height: h,
	width: w,
	top: x - (h),
	left: y,
	backgroundColor:"white",
})

const right = (h, w, x, y) => ({
	position:"absolute",
	height: h,
	width: w,
	top: x,
	left: y + w + 1,
	backgroundColor:"white",
})
const goButton = (h,w,height,width) => ({
	height: 2*h,
	width: 2*w,
	top: height - h,
	left: ((width/2) - (w/2)),
	backgroundColor: "white"
})
const item = (w) => ({
	flex: 1,
	height: w,
	margin: 1,
})
const vertDivUp = (w, x, y) => ({
	position: "absolute",
	height: w,
	width: 10,
	top: y,
	left: x,
	backgroundColor:'red'
})

const vertDivDown = (w, x, y) => ({
	position: "absolute",
	height: w,
	width: 10,
	top: y + w,
	left: x,
	backgroundColor:'red'
})

const horDivLeft = (w, x, y) => ({
	position: "absolute",
	height: 10,
	width: w,
	top: y,
	left: x - w,
	backgroundColor:'red'
})
const horDivRight = (w, x, y) => ({
	position: "absolute",
	height: 10,
	width: w,
	top: y,
	left: x,
	backgroundColor:'red'
})
const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};
 
// Create a client instance
const client = new Client({ uri: 'ws://104.238.164.118:8083/mqtt/', clientId: 'clientId', storage: myStorage });
 
// set event handlers
client.on('connectionLost', (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log(responseObject.errorMessage);
  }
});
client.on('messageReceived', (message) => {
	var msg = message.payloadString;
	msg = msg.split(",");
	wp = msg[0];
	hp = msg[1];

	xp = msg[2];
	yp = msg[3];

	x = xp;
	y = yp;


  console.log(message.payloadString);
  console.log(msg);
});
 
// connect the client
client.connect()
  .then(() => {
    // Once a connection has been made, make a subscription and send a message.
    console.log('onConnect');
    return client.subscribe('bot/location');
  })
  .then(() => {
    console.log('connected');
  })
  .catch((responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  })
;

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trail: [],
		}
	}
	sendDown() {
		console.log('down');
		lastmsg = 'B'
		directions+= "B";
		if(orient == 0){
			if(!started){
				this.state.trail.push(vertDivDown(wb, (ptx+(wb/2)-5), pty));
				pty += 2 * wb;
				ptx = ptx+(wb/2)-5;
				started = true;
			} else {
				this.state.trail.push(vertDivDown(wb, ptx, pty));
				pty += wb;
			}
			
		} else if (orient == 90) {
			if(!started){
				this.state.trail.push(horDivLeft(wb, ptx + wb, (pty + (wb /2) - 5)));
				pty = pty + (wb/2) - 5;
				ptx -= wb * 2;
				started = true;
			} else {
				this.state.trail.push(horDivLeft(wb, ptx, pty));
				ptx -= wb
			}
		} else if (orient == 180) {
			if(!started){
				this.state.trail.push(vertDivUp(wb, (ptx+(wb/2)-5), pty));
				ptx = ptx - wb + 5;
				started = true;
			} else {
				this.state.trail.push(vertDivUp(wb, ptx, pty));
				pty -= wb
			}
		} else if (orient == 270) {
			if(!started){
				this.state.trail.push(horDivRight(wb, ptx, (pty - (wb/2) + 5)));
				pty = pty - wb + 5;
				started = true;
			} else {
				this.state.trail.push(horDivRight(wb, ptx, pty));
				ptx += wb;
			}
		}
		console.log(this.state.trail);
		this.forceUpdate();
	}
	sendUp() {
		console.log('up');
		lastmsg = 'F'
		directions += "F";
		if(orient == 0){
			if(!started){
				this.state.trail.push(vertDivUp(wb, (ptx+(wb/2)-5), pty));
				pty -= wb;
				ptx = ptx+(wb/2)-5;
				started = true;
			} else {
				this.state.trail.push(vertDivUp(wb, ptx, pty));
				pty -= wb;
			}
			
		} else if (orient == 90) {
			if(!started){
				this.state.trail.push(horDivRight(wb, ptx + wb, (pty + (wb /2) - 5)));
				pty = pty + (wb/2) - 5;
				ptx += wb * 2;
				started = true;
			} else {
				this.state.trail.push(horDivRight(wb, ptx, pty));
				ptx += wb
			}
		} else if (orient == 180) {
			if(!started){
				this.state.trail.push(vertDivDown(wb, (ptx+(wb/2)-5), pty));
				ptx = ptx - wb + 5;
				started = true;
			} else {
				this.state.trail.push(vertDivDown(wb, ptx, pty));
				pty += wb
			}
		} else if (orient == 270) {
			if(!started){
				this.state.trail.push(horDivLeft(wb, ptx, (pty - (wb/2) + 5)));
				pty = pty - wb + 5;
				started = true;
			} else {
				this.state.trail.push(horDivLeft(wb, ptx, pty));
				ptx -= wb;
			}
		}
		console.log(this.state.trail);
		this.forceUpdate();
	}
	sendLeft() {
		lastmsg = 'L';
		if(orient == 180){
			pty += wb
		}
		orient -= 90;
		if(orient == -90){
			orient = 270;
			pty -= wb;
		}
		console.log('left', orient);
		directions += "L";
		this.forceUpdate();
	}
	sendRight() {
		lastmsg = 'R';
		if (orient == 90) {
			pty -= wb;
		} else if (orient == 180) {
			pty += wb;
		}
		orient += 90;
		if(orient == 360) {
			orient = 0;
			pty -= wb;
		}
		console.log('right', orient);
		directions += "R"
		this.forceUpdate();
	}
	sendDirections() {
		console.log(directions);
		this.state.trail = [];

		const message = new Message(directions);
	    message.destinationName = 'control/motor';
	    client.send(message);
	    console.log(x, ptx, y, pty);
	    x = pty; 
	    y = ptx; 
	    console.log(x, ptx, y, pty);
		directions = "";
		console.log(this.state.trail);
		this.forceUpdate();
	}
	render() {
		var divs = this.state.trail || [];
		if(orient == 0){
			return(
				<View>
					<View style = {arena(h, w, t, l)}>
						<TouchableHighlight style = {down(wb, wb, x, y)} onPress={() => this.sendDown()}><Text>D</Text></TouchableHighlight>
						<TouchableHighlight style = {up(wb, wb, x, y)} onPress={() => this.sendUp()}><Text>U</Text></TouchableHighlight>
						<TouchableHighlight style = {right(wb, wb, x, y)} onPress={() => this.sendRight()}><Text>R</Text></TouchableHighlight>
						<TouchableHighlight style = {left(wb, wb, x, y)} onPress={() => this.sendLeft()}><Text>L</Text></TouchableHighlight>
						<View style={bot(wb, x, y)}/>
						{this.state.trail.map((div, index) => {
				          return (
				              <View key={index} style={div}>
				              </View>
				            );
				        })}  
					</View>	
					<TouchableHighlight style={goButton(t,90,height,width)} onPress={() => this.sendDirections()}><Text>GO!</Text></TouchableHighlight>
				</View>
			);
		} else if (orient == 90) {
			return(
				<View>
					<View style = {arena(h, w, t, l)}>
						<TouchableHighlight style = {down(wb, wb, x, y)} onPress={() => this.sendRight()}><Text>R</Text></TouchableHighlight>
						<TouchableHighlight style = {up(wb, wb, x, y)} onPress={() => this.sendLeft()}><Text>L</Text></TouchableHighlight>
						<TouchableHighlight style = {right(wb, wb, x, y)} onPress={() => this.sendUp()}><Text>U</Text></TouchableHighlight>
						<TouchableHighlight style = {left(wb, wb, x, y)} onPress={() => this.sendDown()}><Text>D</Text></TouchableHighlight>
						<View style={bot(wb, x, y)}/>
						{this.state.trail.map((div, index) => {
				          return (
				              <View key={index} style={div}>
				              </View>
				            );
				        })}  
					</View>
					<TouchableHighlight style={goButton(t,90,height,width)} onPress={() => this.sendDirections()}><Text>GO!</Text></TouchableHighlight>
				</View>
			);
		} else if (orient == 180) {
			return(
				<View>
					<View style = {arena(h, w, t, l)}>
						<TouchableHighlight style = {down(wb, wb, x, y)} onPress={() => this.sendUp()}><Text>U</Text></TouchableHighlight>
						<TouchableHighlight style = {up(wb, wb, x, y)} onPress={() => this.sendDown()}><Text>D</Text></TouchableHighlight>
						<TouchableHighlight style = {right(wb, wb, x, y)} onPress={() => this.sendLeft()}><Text>L</Text></TouchableHighlight>
						<TouchableHighlight style = {left(wb, wb, x, y)} onPress={() => this.sendRight()}><Text>R</Text></TouchableHighlight>
						<View style={bot(wb, x, y)}/>
						{this.state.trail.map((div, index) => {
				          return (
				              <View key={index} style={div}>
				              </View>
				            );
				        })}  
					</View>
					<TouchableHighlight style={goButton(t,90,height,width)} onPress={() => this.sendDirections()}><Text>GO!</Text></TouchableHighlight>
				</View>
			);
		} else if (orient == 270) {
			return(
				<View>
					<View style = {arena(h, w, t, l)}>
						<TouchableHighlight style = {down(wb, wb, x, y)} onPress={() => this.sendLeft()}><Text>L</Text></TouchableHighlight>
						<TouchableHighlight style = {up(wb, wb, x, y)} onPress={() => this.sendRight()}><Text>R</Text></TouchableHighlight>
						<TouchableHighlight style = {right(wb, wb, x, y)} onPress={() => this.sendDown()}><Text>D</Text></TouchableHighlight>
						<TouchableHighlight style = {left(wb, wb, x, y)} onPress={() => this.sendUp()}><Text>U</Text></TouchableHighlight>
						<View style={bot(wb, x, y)}/>
						{this.state.trail.map((div, index) => {
				          return (
				              <View key={index} style={div}>
				              </View>
				            );
				        })}  
					</View>
					<TouchableHighlight style={goButton(t,90,height,width)} onPress={() => this.sendDirections()}><Text>GO!</Text></TouchableHighlight>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	rect: {
		height: 100, 
		width: 100, 
		backgroundColor: "black",
	},
	list: {
	    flex: 1,
	    top: 0,
	  }
});