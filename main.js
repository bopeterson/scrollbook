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
//const screenwidth = Dimensions.get('window').width; 
//const screenheight = Dimensions.get('window').height;
const {width:screenwidth, height:screenheight}=Dimensions.get('window');
const maxdim=Math.max(screenheight,screenwidth); //width if landscape, height if portrait
const mindim=Math.min(screenheight,screenwidth); //width if protrait, height if landscape

const imwidth = mindim*Environment.imagereduction;
const imheight = imwidth / (Environment.aspectRatio*Environment.imageSideSpace);




const iconwidthPortraitTemp=mindim/2 * 0.7;
const iconheightPortraitTemp=(maxdim-24)*2/9 * 0.7; //2/9 because imageblock is 2 units high, and title block is 1 unit, and total height is 2+2+1+2+2=9 units, -24 because of status bar
const iconwidthPortrait=Math.min(iconwidthPortraitTemp,iconheightPortraitTemp);
console.log(iconwidthPortraitTemp,iconheightPortraitTemp,iconwidthPortrait);

const iconwidthLandscapeTemp=maxdim/4 * 0.7;
const iconheightLandscapeTemp=mindim*3/7 * 0.7; //3/7 because imageblock is 3 units high, and title block is 1 unit, and total height is 3+1+3=7 units
const iconwidthLandscape=Math.min(iconwidthLandscapeTemp,iconheightLandscapeTemp);
console.log(iconwidthLandscapeTemp,iconheightLandscapeTemp,iconwidthLandscape);


const indicatorwidth = imwidth/Assets.images[Assets.mainBookName].length/1.5; 
const indicatorradius = indicatorwidth/2;
const indicatormargin = (imwidth/Assets.images[Assets.mainBookName].length-indicatorwidth)/2;
const speakerwidth = indicatorwidth*0.8;

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const scale = size => mindim / guidelineBaseWidth * size;
const verticalScale = size => maxdim / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;
/*
moderate scale on various devices with factor=0.5 and 0.8
iphone 5s: 95, 93
iphonw 6s: 103, 105
iphone 7: 103, 105
iphone 7+: 109, 114
ipad pro 9.7": 159, 195
ipad pro 10.5": 169, 210
ipad pro 12.9": 196, 254


*/


//stylesheets
const styles = StyleSheet.create({
  container: {flex: 1, 
    flexDirection: 'row',
    backgroundColor: 'black',
  },

  left: {
    flex:1 ,
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'center'
  },
  
  middle: {
    width: imwidth,
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
    alignItems: 'center', //or flex-start to put home button to the left in stead of center. Center looks better 
  },

  imageViewContainer: {
    height: imheight, 
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
    backgroundColor: Environment.buttonColor, 
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

  landscapeStartContainer: {
    flex:1, 
    marginTop:0, 
    backgroundColor:'black',//'red'
  },

  portraitStartContainer: {
    flex:1,
    backgroundColor:'black',//'black'
  },

  landscapeStartMainTitle: {
    flex:1, 
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Environment.textColor,//'green',
  },

  portraitStartMainTitle: {
    flex:1, 
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Environment.textColor,//'green',
  },

  landscapeStartImageBlock: {
    flex:3, 
    flexDirection: 'row', 
    justifyContent:'center',
    alignItems:'center', 
    //backgroundColor:'orange',//'darkblue',
  },

  portraitStartImageBlock: {
    flex:2, 
    flexDirection: 'row', 
    justifyContent:'center',
    alignItems:'center',
  },

  portraitStartSubContainer: {//adjust for status bar on top of portrait
    flex:1,marginTop:24, 
    backgroundColor:'black',//'black',
  },  

  titleText: {
    flex:1,
    //maxWidth:'100%',
    //backgroundColor:'steelblue',//'steelblue'
  },

  imageButtonTouchable: {
    flex:1,
    alignItems:'center',
    margin:1,
    //backgroundColor:'darkgreen',//'green',
  },

  imageButtonImage: {
    //height:iconwidth, sent as prop
    //width:iconwidth, sent as prop
    margin:3,
    //backgroundColor:'darkred',//'yellow',
  },

  bookTitle: {
    //fontWeight:'bold',
    fontSize: moderateScale(12,0.5),
    margin:1, 
    textAlign:'center',
    //backgroundColor:'darkblue', //'black';
    color: Environment.textColor,
  }

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
      logtext: Math.floor(moderateScale(100))+' '+Math.floor(moderateScale(100,0.8)),
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
    clearTimeout(this.speakerTimer2ID);
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
      clearTimeout(this.speakerTimer2ID);
      //don't play sound when moved to start frame
      if (this.state.activeFrame>0) {
        this.delayedPlay(this.state.activeFrame,Environment.playDelay1,Environment.playDelay2);
      }
    }
  }
  
  forcedScrollParent(frame) {
    this._imageView.forcedScrollChild(frame);
  }

  delayedPlay(frame,delay1,delay2) {
    this.speakerTimerID = setTimeout(()=>{
      console.log('delayedPlay');
      clearTimeout(this.scrollLockTimerID);
      this.setState({scrollEnabled:false,speaking:true});
      this.forcedScrollParent(frame);
      this.speakerTimer2ID = setTimeout(()=>{
        this.sounds[frame].play((success) => {
          if (success) {
            this.setState({scrollEnabled:true,speaking:false});
            //console.log('successfully finished playing '+ (frame));
          } else {
            this.setState({scrollEnabled:true,speaking:false});
            //console.log('playback of '+(frame)+'failed');
          }
        });
      },delay2);
    },delay1);
  }

  handlePageNumberPress(frame) {
    if (!this.state.speaking && this.state.activeFrame==frame && frame!=0) {
      this.delayedPlay(frame,1,1);
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
        <View style={[styles.landscapeStartContainer]} onLayout={this.onLayout.bind(this)}>
          <View style={[styles.landscapeStartImageBlock]}>
            <ImageButton onImagePress={this.handleImagePress} bookNo={0} width={iconwidthLandscape}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} bookNo={1} width={iconwidthLandscape}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} bookNo={2} width={iconwidthLandscape}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} bookNo={3} width={iconwidthLandscape}></ImageButton>
          </View>
          <View style={[styles.landscapeStartMainTitle]}>
            <TitleText source={Assets.mainTitleImage}></TitleText>
          </View>
          <View style={[styles.landscapeStartImageBlock]}>
            <ImageButton onImagePress={this.handleImagePress} bookNo={4} width={iconwidthLandscape}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} bookNo={5} width={iconwidthLandscape}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} bookNo={6} width={iconwidthLandscape}></ImageButton>
            <ImageButton onImagePress={this.handleImagePress} bookNo={7} width={iconwidthLandscape}></ImageButton>
          </View>
        </View>
      )
    } else { //PORTRAIT
      return (
        <View style={[styles.portraitStartContainer]} onLayout={this.onLayout.bind(this)}>
          <View style={[styles.portraitStartSubContainer]}>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={0} width={iconwidthPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={1} width={iconwidthPortrait}></ImageButton>
            </View>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={2} width={iconwidthPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={3} width={iconwidthPortrait}></ImageButton>
            </View>
            <View style={[styles.portraitStartMainTitle]}>
              <TitleText source={Assets.mainTitleImage}></TitleText>
            </View>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={4} width={iconwidthPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={5} width={iconwidthPortrait}></ImageButton>
            </View>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={6} width={iconwidthPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={7} width={iconwidthPortrait}></ImageButton>
            </View>
          </View>
        </View>
      );
    }
  }
}


class TitleTextTest extends React.Component {
  render() {
    return ( 
      <Text 
        style={{fontFamily: 'Iowan Old Style', fontWeight: 'bold', color:'#f4c053',fontSize:moderateScale(28,0.9)}} 
        resizeMode = {'contain'} 
        source={this.props.source}
      >
        Så gör man
      </Text>
    )
  }
}

class OldTitleText extends React.Component {
  render() {
    return ( 
      <Image 
        style={[styles.titleText]} 
        resizeMode = {'contain'} 
        source={this.props.source}
      >
      </Image>
    )
  }
}


class TitleText extends React.Component {
  constructor(props) {
    super(props);
    this.handlePress=this.handlePress.bind(this);
  }

  handlePress(e) {    
    //let parent handle:     
    this.props.onTitlePress();
  }

  render() {
    return (
      <TouchableOpacity 
        onPress={(e) => this.handlePress(e)} 
        activeOpacity={0.6}
      >
        <Image 
          style={[styles.titleText]} 
          resizeMode = {'contain'} 
          source={this.props.source}
          >
        </Image>
      </TouchableOpacity>
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
    this.book=Assets.bookOrder[this.props.bookNo]; //why doesn't just book whithout this work when sent to handlePress?
    this.src=Assets.titleImages[this.book];
    return (
      <TouchableOpacity 
        style={[styles.imageButtonTouchable]}
        onPress={(e) => this.handlePress(e,this.book)} 
        activeOpacity={0.6}
      >
        <Image style={[styles.imageButtonImage,{width:this.props.width,height:this.props.width}]} resizeMode = {'contain'} source={this.src}>
        
        </Image>
        <BookTitle book={Assets.bookTitles[this.book]}>
        </BookTitle>
      </TouchableOpacity>
    )
  }
}

class BookTitle extends React.Component {
  render() {
    if (Environment.showBookTitle) {
      return(
        <Text style={[styles.bookTitle]}>
          {this.props.book}
        </Text>
      )      
    } else {
      return null;
    }
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

