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
  Button, //not needed in the future
} from 'react-native';

import Sound from 'react-native-sound';

import { 
  StackNavigator,
  NavigationActions,
} from 'react-navigation';

const Environment = require('./environment.js');
const Assets = require('./assets.js');

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

prettylog('assets',Assets);

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
const styles = StyleSheet.create({
  container: {flex: 1, 
    flexDirection: 'row',
    backgroundColor: 'black', //black
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
    flex: 1,
    justifyContent:'center',
  },

  leftVerticalPlaceholder: {
    //backgroundColor:'darkred',
    height:imheight,
    width:10,
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
    this.book=this.props.navigation.state.params.book;
    this.images=Assets.images[this.book];
    this.sounds = Assets.soundFiles[this.book].map((src)=>{return new Sound(src, Sound.MAIN_BUNDLE)});

    this.state = {
      orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT',
      activeFrame: 0,
      scrollEnabled: true,
      speaking: false,
      logtext: JSON.stringify(Environment),
      //load 2 images from start, or all images:
      framesToLoad: Environment.gradualLoad ? 2 : Assets.images[this.book].length, 
    };
    this.handleImageViewScroll = this.handleImageViewScroll.bind(this);    
    this.handlePageNumberPress = this.handlePageNumberPress.bind(this);
    this.handleBackButtonPress = this.handleBackButtonPress.bind(this);
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
    clearTimeout(this.speakerTimerID);
    clearTimeout(this.scrollLockTimerID);
    clearTimeout(this.loadTimerID);
    if (this.state.speaking) {
      this.sounds[this.state.activeFrame].stop();
    }
  }

  componentDidUpdate(prevProps, prevState) {    
    //play sound when swiped to new image, except when swiped to cover image (frame 0)
    if (prevState.activeFrame!==this.state.activeFrame) {
      if (Environment.gradualLoad) {
        //load one frame beyond current active frame. This state can only increase but not decrease. When scrolling backwards, all frames that have been shown remain loaded. 
        this.loadTimerID=setTimeout(()=>{
          this.setState(
            (prevState,props) => ({framesToLoad:Math.max(this.state.activeFrame+2,prevState.framesToLoad)})
          )
        },100);
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
    //Back button can be pressed while speaking
    //Consider disabling the back button while speaking 
    this.props.navigation.dispatch(backAction);
  }

    
  handleImageViewScroll(e) {
    const x = e.contentOffset.x;
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
    this.setState({orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT'});
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
     <View style={[styles.container]} onLayout={this.onLayout.bind(this)}>
        <View style={[styles.left]}>
          <View style={[styles.leftVerticalPlaceholder]}></View>
          <BackButton onBackButtonPress={this.handleBackButtonPress} orientation={this.state.orientation} renderIf={'LANDSCAPE'}/>
        </View>
        <View style={[styles.middle]}>
          <View style={[styles.mainContent]}>
            <View style={[styles.imageViewContainer]}>
              <ImageView
                ref={instance => { this._imageView = instance; }}
                onImageViewScroll={this.handleImageViewScroll}
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
  }
  
  componentDidMount() {

  }
  
  handleScroll(e) {
    //prettylog("scroll event",e.nativeEvent);
    this.props.onImageViewScroll(e.nativeEvent);
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
    if (Environment.showLog) {
      return <Text style={{ color: 'white', fontFamily: 'Courier' }}>Log: {this.props.text}</Text>
    } else {
      return null;
    }
  }
}

class StartScreen extends React.Component {
  static navigationOptions = {
    title: 'Start',
  };
  
  constructor(props) {
    super(props);
    this.state = {
      orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT',
    }
    super(props);
    this.handleImagePress = this.handleImagePress.bind(this);
    
  }
  
  onLayout(e) {
    const {width, height} = Dimensions.get('window');
    this.setState({orientation:Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT'});
  }
  
  
  handleImagePress(book) {
    const { navigate } = this.props.navigation;
    navigate('Main',{ book: book })
  }
  
  render() {
    const { navigate } = this.props.navigation;
    if (this.state.orientation=='LANDSCAPE') {
      return (
        <View style={{flex:1}} onLayout={this.onLayout.bind(this)}>
          <View style={{flex:2, flexDirection: 'row', justifyContent:'center',alignItems:'center'}}>
            <ImageButton onImagePress={this.handleImagePress} color='steelblue' bookNo={0}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} color='powderblue' bookNo={1}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} color='steelblue' bookNo={2}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} color='powderblue' bookNo={3}></ImageButton>
          </View>
          <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <TitleText source={Assets.titleImages.plane}></TitleText>
          </View>
          <View style={{flex:2, flexDirection: 'row', justifyContent:'center',alignItems:'center'}}>
            <ImageButton onImagePress={this.handleImagePress} color='steelblue' bookNo={4}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} color='powderblue' bookNo={5}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} color='steelblue' bookNo={6}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} color='powderblue' bookNo={7}></ImageButton>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{flex:1, justifyContent: 'center',alignItems: 'center'}} onLayout={this.onLayout.bind(this)}>
          <Text>Så gör man - Ljud- och bildböcker av Ann Gomér med illustrationer av ??? ???</Text>
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
}

class TitleText extends React.Component {
  render() {
    return ( 
      <Image 
        style={{flex:1,backgroundColor:'skyblue'}} 
        resizeMode = {'contain'} 
        source={this.props.source}
      >
      </Image>
    )
  }
}

class ImageButton extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress=this.handlePress.bind(this);
  }
  
  handlePress(e,book) {    
    //let parent handle:     
    this.props.onImagePress(book);
  }
  
  render() {
    this.book=Assets.bookOrder[this.props.bookNo];
    this.src=Assets.titleImages[this.book];
    return (
      <TouchableOpacity 
        style={{flex:1,margin:10,backgroundColor:this.props.color}}
        onPress={(e) => this.handlePress(e,this.book)} 
        activeOpacity={0.6}
      >
        <Image style={{maxHeight:'100%',maxWidth:'100%'}} resizeMode = {'contain'} source={this.src}></Image> 
      </TouchableOpacity>
    )
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

