//ändra alla var till let eller const

import {AppRegistry} from 'react-native';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Button, //not needed in the future
} from 'react-native';

import Sound from 'react-native-sound';

import { 
  StackNavigator,
  NavigationActions,
} from 'react-navigation';

var Environment = require('./environment.js');
var Assets = require('./assets.js');



// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

prettylog('assets',Assets);

//weird-the map version above works fine on ios but didn't seem to work on android.
//hm, now it seems to work.....
//let oldSounds=[];
//for (let i=0;i<Assets.soundFiles.length;i++) {
//  console.log('====================================');
//  const oneSound=new Sound(Assets.soundFiles[i], Sound.MAIN_BUNDLE, (error)=>{if (error){console.log('failed to load',error);return;}console.log('duration '+oneSound.getDuration())});
//  oldSounds.push(oneSound);
//}

const oldSounds = Assets.soundFiles['plane'].map((src)=>{return new Sound(src, Sound.MAIN_BUNDLE)});

//constants for defining size of components
const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;
const imwidth = Math.min(screenwidth,screenheight)*Environment.imagereduction;
const imheight = imwidth / (Environment.aspectRatio*Environment.imageSideSpace);

const indicatorwidth = imwidth/Assets.images[Assets.mainBookName].length/1.5; 
const indicatorradius = indicatorwidth/2;
const indicatormargin = (imwidth/Assets.images[Assets.mainBookName].length-indicatorwidth)/2;
const speakerwidth = indicatorwidth*0.8;


//stylesheets
var styles = StyleSheet.create({
  container: {flex: 1, 
    flexDirection: 'row',
    backgroundColor: 'darkred', //black
  },
  
  left: {
    flex:1 ,
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'center'
  },
  
  middle: {
    width: imwidth, //xxx reduntant??? see *
  },
  
  right: {
    flex: 1
  },

  mainContent: {
    flex: 1, 
    justifyContent: 'center', 
    flexDirection: 'column',
    alignItems: 'center', //or flex-start xxx 
  },

  
  imageViewContainer: {
    width: imwidth, //* in middle instead???
    height: imheight, //not needed?
    backgroundColor: '#222222'
  },
  
  image: { 
    width: imwidth, 
    height: imheight 
  },
  
  indicator: {
    width: indicatorwidth, 
    height: indicatorwidth,
    borderRadius: indicatorradius,
    margin: indicatormargin, 
    backgroundColor: '#f4c053', //'#FF5959', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  
  progressView: { 
    flexDirection: 'row'
  },
  
  speaker: {
    width: speakerwidth, 
    height: speakerwidth
  },

  backButton: {
    width: indicatorwidth, 
    height: indicatorwidth,
    margin: indicatormargin, 
  },

});


//debug functions
function prettylog(text,obj) {
  str=JSON.stringify(obj, null, 4);
  console.log(text+": "+str);
}

prettylog("windowdimensions",Dimensions.get('window'));

export default class MainView extends React.Component {
  static navigationOptions = {
    title: 'Bok',
    gesturesEnabled: false,
  };

  constructor(props) {
    super(props);

    //pseudo-states
    this.swipeOutside=false;
    this.closestFrame=0;
    this.book=this.props.navigation.state.params.book;
    this.images=Assets.images[this.book];
    this.sounds = Assets.soundFiles[this.book].map((src)=>{return new Sound(src, Sound.MAIN_BUNDLE)});

    this.state = {
      orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT',
      activeFrame: 0,
      scrollEnabled: true,
      speaking: false,
      logtext: 'Entering '+this.props.navigation.state.params.book,
      //load 2 images from start, or all images:
      framesToLoad: Environment.gradualLoad ? 2 : Assets.images[this.book].length, 
    };
    this.handleImageViewScroll = this.handleImageViewScroll.bind(this);
    this.handleImageViewMove = this.handleImageViewMove.bind(this);
    
    this.handlePageNumberPress = this.handlePageNumberPress.bind(this);
    this.handleBackButtonPress = this.handleBackButtonPress.bind(this);
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
    clearTimeout(this.speakerTimerID);
    clearTimeout(this.scrollLockTimerID);
    if (this.state.speaking) {
      this.sounds[this.state.activeFrame].stop();
    }
  }

  componentDidUpdate(prevProps, prevState) {    
    //play sound when swiped to new image, except when swiped to cover image (frame 0)
    if (prevState.activeFrame!==this.state.activeFrame) {
      if (Environment.gradualLoad) {
        //load one frame beyond current active frame. This state can only increase but not decrease. When scrolling backwards, all frames that have been shown remain loaded. 

        //xxx this timeout must be cleard in unmount
        setTimeout(()=>{this.setState((prevState,props) => ({framesToLoad:Math.max(this.state.activeFrame+2,prevState.framesToLoad)}))},100);
        
      }
      //always clear queued sounds that havent't started when moved to a new frame
      clearTimeout(this.speakerTimerID);
      //don't play sound when moved to start frame
      if (this.state.activeFrame>0) {
        this.delayedPlay(this.state.activeFrame,Environment.playDelay);
      }
    }
  }
  
  forcedScrollParent(frame) {
    this._imageView.forcedScrollChild(frame);
  }
  
  
  
  delayedPlay(frame,delay) {
    this.speakerTimerID = setTimeout(()=>{
      console.log('delayedPlay');
      clearTimeout(this.scrollLockTimerID);
      this.setState({scrollEnabled:false,speaking:true});
      this.forcedScrollParent(frame);

      this.sounds[frame].play((success) => {
        if (success) {
          this.setState({scrollEnabled:true,speaking:false});
          //console.log('successfully finished playing '+ (frame));
        } else {
          this.setState({scrollEnabled:true,speaking:false});
          //console.log('playback of '+(frame)+'failed');
        }
      });
    },delay);
  }
    
  handlePageNumberPress(frame) {
    if (!this.state.speaking && this.state.activeFrame==frame && frame!=0) {
      this.delayedPlay(frame,1);
    }
  }

  handleBackButtonPress() {
    const backAction = NavigationActions.back({
      //key: 'Profile'
    });    
    this.props.navigation.dispatch(backAction);
    //xxx ev bara om den inte pratar 
  }

    
  handleImageViewScroll(e) {
    const x = e.contentOffset.x;
    const leftBorderFrame = Math.floor(x/imwidth);
    const approachingFrame = Math.floor(x/imwidth+Environment.delta);
    const signedOffset = ((x+imwidth/2)%imwidth-imwidth/2)/imwidth;//simplify???
    const offset = Math.abs(signedOffset);
    this.closestFrame = Math.floor((x+imwidth/2)/imwidth);
    
    if (offset < Environment.delta) {
      this.setState({
          activeFrame:approachingFrame,
      });
    }
  }
  
  handleImageViewMove(e) {
    //this hardcoded xxx must be calucaled from xxx.measure
    if (!Environment.allowSwipeOutsideImage) {
      if (e.pageX<184 && !this.swipeOutside) {
        this.swipeOutside=true;
        this.setState({scrollEnabled:false});
        this.forcedScrollParent(this.closestFrame);
        this.xxxTimerID = setTimeout(()=>{
          this.setState({scrollEnabled:true});
          this.swipeOutside=false;
        },300);
      } else if (e.pageX>=184){
        this.swipeOutside=false;
      }
    }
  }


  
  onLayout(e) {
    const {width, height} = Dimensions.get('window');
    this.setState({orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT'});
    
    this.refs.xxx.measure( (fx, fy, width, height, px, py) => {
            const text=//'Component width is: ' + width +
                       //'Component height is: ' + height +
                       //'X offset to frame: ' + fx +
                       //'Y offset to frame: ' + fy +
                      ' x:' + px //+
                       //'Y offset to page: ' + py;
            this.setState({logtext:text})
        });        
    
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
     <View style={[styles.container]} onLayout={this.onLayout.bind(this)}>
        <View style={[styles.left]}>
        <BackButton onBackButtonPress={this.handleBackButtonPress} orientation={this.state.orientation} renderIf={'LANDSCAPE'}/>
        </View>
        <View style={[styles.middle]}>
          <View style={[styles.mainContent]}>
            <View style={[styles.imageViewContainer]} ref='xxx'>
              <ImageView onLayout={this._onLayout}
                ref={instance => { this._imageView = instance; }}
                onImageViewScroll={this.handleImageViewScroll}
                onImageViewMove={this.handleImageViewMove}
                scrollEnabled={this.state.scrollEnabled}
                framesToLoad={this.state.framesToLoad}
                images={this.images}
              />
            </View>
            <ProgressView
              frame={this.state.activeFrame} 
              onPageNumberPress={this.handlePageNumberPress}
              showSpeaker={this.state.speaking}
              images={this.images}
            />
              
            <BackButton onBackButtonPress={this.handleBackButtonPress}
orientation={this.state.orientation} renderIf={'PORTRAIT'} />

            
          </View>
        </View>
        <View style={[styles.right]}>
            {<Log text={this.state.logtext} />}
        </View>
      </View>

    );
  }
}

class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.handleScroll=this.handleScroll.bind(this);
    this.handleMove=this.handleMove.bind(this);
  }
  
  componentDidMount() {

  }
  
  handleScroll(e) {
    //prettylog("scroll event",e.nativeEvent);
    this.props.onImageViewScroll(e.nativeEvent);
  }
  
  handleMove(e) {
    this.props.onImageViewMove(e.nativeEvent);
  }
    
  forcedScrollChild(frame) {
    this._scrollView.scrollTo({x: frame*imwidth, y: 0, animated: Environment.animateForcedScroll})
  }

  render() {
    return (
      <ScrollView
      ref={instance => { this._scrollView = instance; }} //makes component methods like scrollTo accessible
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={Environment.deceleration}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={this.props.scrollEnabled}
        onScroll={this.handleScroll}
        onResponderMove={this.handleMove}
        scrollEventThrottle={Environment.scrollThrottle}
      >
      {this.props.images.slice(0,this.props.framesToLoad).map((src, i) => {
          return (
            <Image
              key={i}
              resizeMode = {'contain'}
              style={[styles.image]}
              source={src}
            ></Image>
          );
        })}
      </ScrollView>
    );
  }
}


class SpeakerImage extends React.Component {
  render() {
    if (this.props.showSpeaker) {
      return <Image style={[styles.speaker]} source={Assets.speakerIcon} />;
    } else {
      return null;
    }
  }
}

class BackButton extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress=this.handlePress.bind(this);
  }

  handlePress(e) {    
    //let parent handle:     
    this.props.onBackButtonPress();
  }

  render() {
    if (this.props.orientation==this.props.renderIf) {      
      return (
        <TouchableOpacity 
          onPress={(e) => this.handlePress(e)} 
          activeOpacity={0.6}
        >
          <Image style={[styles.backButton]} source={Assets.backIcon} />
        </TouchableOpacity>
      )
    } else {
      return null;
    }
  }
}

class ProgressView extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress=this.handlePress.bind(this);
  }
  
  componentDidMount() {

  }
  
  handlePress(e,frame) {
    //let parent handle:     
    this.props.onPageNumberPress(frame);
  }
  
  render() {
    return (
      <View>
        <View style={[styles.progressView]}>
          {this.props.images.map((_, i) => {
            //would be good to make this content into a component
            let opacity=0.3;
            let showSpeakerCurrent=false;
            if (i===this.props.frame) {
              opacity=1.0;
              showSpeakerCurrent=this.props.showSpeaker;
            }
            return (
              <TouchableOpacity 
                key={i} 
                onPress={(e) => this.handlePress(e, i)} 
                activeOpacity={0.6}
              >
                <View style={[styles.indicator,{opacity: opacity}]}>
                  <SpeakerImage showSpeaker={showSpeakerCurrent} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

class Log extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Text style={{ color: 'white', fontFamily: 'Courier' }}>Log: {this.props.text}</Text>
    )
  }
}

class StartScreen extends React.Component {
  static navigationOptions = {
    title: 'Start',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{flex:1, justifyContent: 'center',alignItems: 'center'}}>
        <Text>Så gör man - Ljud- och bildböcker av Ann Gomér med illustrationer av Xxx Xxxxx</Text>
      <Button style={{backgroundColor:'darkred'}}
          onPress={() => navigate('Main',{ book: Assets.bookOrder[0] })}
          title={Assets.bookTitles[Assets.bookOrder[0]]}
        />
        <Button
          style={{backgroundColor:'darkblue'}}
          onPress={() => navigate('Main',{ book: Assets.bookOrder[1] })}
          title={Assets.bookTitles[Assets.bookOrder[1]]}
        />
        <Button
          style={{backgroundColor:'darkgreen'}}
          onPress={() => navigate('Main',{ book: Assets.bookOrder[2] })}
          title={Assets.bookTitles[Assets.bookOrder[2]]}
        />
      </View>
    );
  }
}

const MainNavigator = StackNavigator(
  {
    Start: { screen: StartScreen },
    Main: { screen: MainView },
  },{
    headerMode:'none'
  }
);

AppRegistry.registerComponent('Flyg', () => MainNavigator);

