//ändra alla var till let eller const
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
  Platform
} from 'react-native';
import Sound from 'react-native-sound';

var Environment = require('./environment.js');
var Assets = require('./assets.js');

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

prettylog('assets',Assets);

const sounds = Assets.soundFiles.map((src)=>{return new Sound(src, Sound.MAIN_BUNDLE)});

//weird-the map version above works fine on ios but didn't seem to work on android.
//hm, now it seems to work.....
//let sounds=[];
//for (let i=0;i<Assets.soundFiles.length;i++) {
//  const oneSound=new Sound(Assets.soundFiles[i], Sound.MAIN_BUNDLE);
//  sounds.push(oneSound);
//}

//constants for defining size of components
//better as properties of SoundTest?
const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;
const imwidth = Math.min(screenwidth,screenheight)*Environment.imagereduction;
const imheight = imwidth / (Environment.aspectRatio*Environment.imageSideSpace);
const indicatorwidth = imwidth/Assets.photos.length/1.5;
const indicatorradius = indicatorwidth/2;
const indicatormargin = (imwidth/Assets.photos.length-indicatorwidth)/2;
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
    alignItems: 'flex-start', 
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
  },
  
  backButtonBellow: {
    margin: indicatormargin, 
    backgroundColor: 'darkblue',
  },

  backButtonLeft: {
    margin: indicatormargin, 
    backgroundColor: 'red',
  },



});


//debug functions
function prettylog(text,obj) {
  str=JSON.stringify(obj, null, 4);
  console.log(text+": "+str);
}

prettylog("windowdimensions",Dimensions.get('window'));

export default class MainView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT',
      activeFrame: 0,
      scrollEnabled: true,
      speaking: false,
      logtext: JSON.stringify(Platform),
      framesToLoad: Environment.gradualLoad ? 2 : Assets.photos.length //load 2 images from start, or all images
    };
    this.handleImageViewScroll = this.handleImageViewScroll.bind(this);
    this.handlePageNumberPress = this.handlePageNumberPress.bind(this);
    this.handleBackButtonPress = this.handleBackButtonPress.bind(this);
    //this.pageNumberPressTime=0;
  }
  
  componentDidMount() {

  }
  
  componentWillUnmount() {
      clearTimeout(this.speakerTimerID);
      clearTimeout(this.scrollLockTimerID);
  }

  componentDidUpdate(prevProps, prevState) {    
    //play sound when swiped to new image, except when swiped to cover image (frame 0)
    if (prevState.activeFrame!==this.state.activeFrame) {
      if (Environment.gradualLoad) {
        //load one frame beyond current active frame. This state can only increase but not decrease. When scrolling backwards, all frames that have been shown remain loaded. 

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
      //console.log('delayedPlay '+(frame)+ ' ');
      clearTimeout(this.scrollLockTimerID);
      this.setState({scrollEnabled:false,speaking:true});
      this.forcedScrollParent(frame);
      sounds[frame].play((success) => {
        if (success) {
          this.setState({scrollEnabled:true,speaking:false});
          //console.log('successfully finished playing '+ (frame));
        } else {
          this.setState({scrollEnabled:true,speaking:false});
          console.log('playback of '+(frame)+'failed');
        }
      });
    },delay);
  }
    
  handlePageNumberPress(frame) {
    this.setState({logtext:this.state.framesToLoad});
    if (!this.state.speaking && this.state.activeFrame==frame && frame!=0) {
      this.delayedPlay(frame,1);
    }
  }

  handleBackButtonPress() {
    this.setState({logtext:"back xxx"});
  }


    
  handleImageViewScroll(x) {
    const leftBorderFrame = Math.floor(x/imwidth);
    const approachingFrame = Math.floor(x/imwidth+Environment.delta);
    const signedOffset = ((x+imwidth/2)%imwidth-imwidth/2)/imwidth;//simplify???
    const offset = Math.abs(signedOffset);
    
    if (offset < Environment.delta) {
      this.setState({
        activeFrame:approachingFrame,
      });
      
      
    }
  }


  
  onLayout(e) {
    const {width, height} = Dimensions.get('window');
    this.setState({logtext:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT'});
    this.setState({orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT'});
  }

  render() {
    return (
     <View style={[styles.container]} onLayout={this.onLayout.bind(this)}>
        <View style={[styles.left]}>
        <BackButtonLeft onBackButtonPress={this.handleBackButtonPress} orientation={this.state.orientation} />
        </View>
        <View style={[styles.middle]}>
          <View style={[styles.mainContent]}>
            <View style={[styles.imageViewContainer]}>
              <ImageView onLayout={this._onLayout}
                ref={instance => { this._imageView = instance; }}
                onImageViewScroll={this.handleImageViewScroll}
                scrollEnabled={this.state.scrollEnabled}
                framesToLoad={this.state.framesToLoad}
              />
            </View>
            <ProgressView
              frame={this.state.activeFrame} 
              onPageNumberPress={this.handlePageNumberPress}
              showSpeaker={this.state.speaking}
            />
            <BackButtonBelow onBackButtonPress={this.handleBackButtonPress}
orientation={this.state.orientation} />

            {<Log text={this.state.logtext} />}
          </View>
        </View>
        <View style={[styles.right]} />
      </View>

    );
  }
}

class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.handleScroll=this.handleScroll.bind(this);
  }
  
  componentDidMount() {

  }
  
  handleScroll(e) {
    //prettylog("scroll event",e.nativeEvent);
    this.props.onImageViewScroll(e.nativeEvent.contentOffset.x);
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
        scrollEventThrottle={Environment.scrollThrottle}
      >
        {Assets.photos.slice(0,this.props.framesToLoad).map((src, i) => {
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

class BackButtonLeft extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress=this.handlePress.bind(this);
  }

  handlePress(e) {    
    //let parent handle:     
    this.props.onBackButtonPress();
  }

  render() {
    if (this.props.orientation=='PORTRAIT') {
      return null;
    } else {
      return (
        <TouchableOpacity 
          onPress={(e) => this.handlePress(e)} 
          activeOpacity={0.6}
        >
          <BackButton style={styles.backButtonLeft}/>
        </TouchableOpacity>
      )
    }
  }
}

class BackButtonBelow extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress=this.handlePress.bind(this);
  }

  handlePress(e) {    
    //let parent handle:     
    this.props.onBackButtonPress();
  }

  render() {
    if (this.props.orientation=='LANDSCAPE') {
      return null;
    } else {
      return (
        <TouchableOpacity 
          onPress={(e) => this.handlePress(e)} 
          activeOpacity={0.6}
        >
          <BackButton style={styles.backButtonBellow}/>
        </TouchableOpacity>
      )
    }
  }
}

class BackButton extends React.Component {
  
  
  
  render() {
    return (
        <Image style={[styles.backButton, this.props.style]} source={Assets.backIcon} />
    );
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
          {Assets.photos.map((_, i) => {
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
      <Text style={{ color: 'white' }}>Log: {this.props.text}</Text>
    )
  }
}
