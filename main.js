import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  StatusBar,
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

//debug function
const prettyLog = (obj,text='log') => {
  str=JSON.stringify(obj, null, 4);
  console.log(text+": "+str);  
}

const getOrientation = () => (
  Dimensions.get('window').width>Dimensions.get('window').height ? 'LANDSCAPE' : 'PORTRAIT'
);

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const scale = size => minDim / guidelineBaseWidth * size;
const verticalScale = size => maxDim / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

//general screen size constants
const {width:screenwidth, height:screenheight}=Dimensions.get('window');
const maxDim=Math.max(screenheight,screenwidth); //width if landscape, height if portrait
const minDim=Math.min(screenheight,screenwidth); //width if portrait, height if landscape

//size contstants for book 
const imageWidth = minDim*Environment.imagereduction;
const imageHeight = imageWidth / (Environment.aspectRatio*Environment.imageSideSpace);
const indicatorWidth = imageWidth/Assets.images[Assets.mainBookName].length/1.5; 
const indicatorRadius = indicatorWidth/2;
const indicatorMargin = (imageWidth/Assets.images[Assets.mainBookName].length-indicatorWidth)/2;
const speakerWidth = indicatorWidth*0.8;

//size constants for start screen
const imageBlockTextSize = moderateScale(16,0.3);
const imageBlockTextMaxRows = 2;
const imageBlockTextHeight = imageBlockTextSize * imageBlockTextMaxRows * 1.3; //1.1875 minimum factor on ios
//Landscape
const imageBlockFlexLandscape = 3; //could be in environment
const titleTextFlexLandscape = 1; //could be in environment
const imageBlockHeightLandscape = (minDim-Environment.statusBarHeight) * imageBlockFlexLandscape /(2*imageBlockFlexLandscape+titleTextFlexLandscape);
const titleTextHeightLandscape = (minDim-Environment.statusBarHeight) * titleTextFlexLandscape /(2*imageBlockFlexLandscape+titleTextFlexLandscape);
const imageButtonMaxHeightLandscape = imageBlockHeightLandscape * 0.9; //image and text
let imageButtonImageMaxWidthLandscape = maxDim/4 * 0.9;
let imageButtonImageMaxHeightLandscape = imageButtonMaxHeightLandscape - imageBlockTextHeight;
imageButtonImageMaxHeightLandscape=Math.min(imageButtonImageMaxHeightLandscape,imageButtonImageMaxWidthLandscape);
imageButtonImageMaxWidthLandscape=imageButtonImageMaxHeightLandscape;
//Portrait
const imageBlockFlexPortrait = 2; //could be in environment
const titleTextFlexPortrait = 1; //could be in environment
const imageBlockHeightPortrait = (maxDim-Environment.statusBarHeight) * imageBlockFlexPortrait /(4*imageBlockFlexPortrait+titleTextFlexPortrait);
const titleTextHeightPortrait = (maxDim-Environment.statusBarHeight) * titleTextFlexPortrait /(4*imageBlockFlexPortrait+titleTextFlexPortrait);
const imageButtonMaxHeightPortrait = imageBlockHeightPortrait * 0.9; //image and text
let imageButtonImageMaxWidthPortrait = maxDim/2 * 0.9;
let imageButtonImageMaxHeightPortrait = imageButtonMaxHeightPortrait - imageBlockTextHeight;
imageButtonImageMaxHeightPortrait=Math.min(imageButtonImageMaxHeightPortrait,imageButtonImageMaxWidthPortrait);
imageButtonImageMaxWidthPortrait=imageButtonImageMaxHeightPortrait;

//stylesheets
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'row',
    backgroundColor: Environment.mainViewColor,
  },

  left: {
    flex:1 ,
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'center'
  },
  
  middle: {
    width: imageWidth,
  },
  
  right: {
    flex: 1,
    justifyContent:'center',
  },

  leftVerticalPlaceholder: {
    height:imageHeight,
    width:10,
  },

  mainContent: {
    flex: 1, 
    justifyContent: 'center', 
    flexDirection: 'column',
    alignItems: 'center',
  },

  imageViewContainer: {
    height: imageHeight, 
    backgroundColor: '#111111'
  },

  image: { 
    width: imageWidth, 
    height: imageHeight 
  },

  indicator: {
    width: indicatorWidth, 
    height: indicatorWidth,
    borderRadius: indicatorRadius,
    margin: indicatorMargin, 
    backgroundColor: Environment.buttonColor, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  progressView: { 
    flexDirection: 'row'
  },

  speaker: {
    width: speakerWidth, 
    height: speakerWidth
  },

  backButton: {
    width: indicatorWidth, 
    height: indicatorWidth,
    margin: indicatorMargin, 
    backgroundColor: Environment.buttonColor,
  },

  landscapeStartContainer: {
    flex:1, 
    marginTop:0, 
    backgroundColor:Environment.statusBarColorLandscape,
  },

  portraitStartContainer: {
    flex:1,
    backgroundColor:Environment.statusBarColorPortrait,
  },

  landscapeStartMainTitle: {
    flex:titleTextFlexLandscape, 
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Environment.startViewColor,//xxx Environment.textColor, //Environment.textColor eller ingen color beroende på om man använder titleText eller titleTextCustomFont
  },

  portraitStartMainTitle: {
    flex:titleTextFlexPortrait, 
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Environment.startViewColor,//xxx Environment.textColor, //Environment.textColor eller ingen color beroende på om man använder titleText eller titleTextCustomFont
  },

  landscapeStartImageBlock: {
    flex:imageBlockFlexLandscape, 
    flexDirection: 'row', 
    justifyContent:'center',
    alignItems:'center', 
  },

  portraitStartImageBlock: {
    flex: imageBlockFlexPortrait, 
    flexDirection: 'row', 
    justifyContent:'center',
    alignItems:'center',
  },

  landscapeStartSubContainer: {//adjust for status bar on top
    flex:1,
    marginTop:Environment.statusBarHeight, 
    backgroundColor:Environment.startViewColor,
  },  


  portraitStartSubContainer: {//adjust for status bar on
    flex:1,
    marginTop:Environment.statusBarHeight, 
    backgroundColor:Environment.startViewColor,
  },  

  titleText: {
    flex:1,
  },

  titleTextCustomFont: {
    //height: sent as prop
    //fontFamily:'Futura', //'Iowan Old Style', 
    //fontWeight: 'bold',
    color: Environment.textColor,
    fontSize:moderateScale(28,0.9),
  },

  imageButtonTouchable: {
    flex:1,
    alignItems:'center',
    margin:0,
    padding:0,
  },

  imageButtonImage: {
    //height sent as prop
    //width sent as prop
    margin:0,
  },
  
  bookTitle: {
    padding:0,
    fontSize: imageBlockTextSize, 
    margin:0, 
    textAlign:'center',
    color: Environment.textColor,
    height:imageBlockTextHeight,
  },
  
  creditsContainer: {
    flex: 1,
    padding:20,
    backgroundColor:'lightyellow',
  },
  
  creditsText: {
    fontSize: 38,
    color:'steelblue',
    //backgroundColor:'darkblue',
    
  },
  
  creditsNavigator: {
    //backgroundColor:'black',
  },
});

export default class MainView extends React.Component {
  static navigationOptions = {
    title: 'Bok',
    gesturesEnabled: false,
    //header: null, use headerMode instead
  };

  constructor(props) {
    super(props);

    //pseudo-states
    this.book=this.props.navigation.state.params.book;
    this.images=Assets.images[this.book];
    
    //this.sounds = Assets.soundFiles[this.book].map((src)=>{return new Sound(src, Sound.MAIN_BUNDLE)});
    this.sounds = [];
    for (let i=0;i<Assets.soundFiles[this.book].length;i++) {
      var oneSound=new Sound(Assets.soundFiles[this.book][i], Sound.MAIN_BUNDLE, (error)=>{
        if (error) {
          return;
        }
      });
      this.sounds.push(oneSound);
    }

    this.state = {
      orientation:getOrientation(),
      activeFrame: 0,
      scrollEnabled: true,
      speaking: false,
      logtext: JSON.stringify(Dimensions.get('window')),
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
      clearTimeout(this.scrollLockTimerID);
      this.setState({scrollEnabled:false,speaking:true});
      this.forcedScrollParent(frame);
      this.speakerTimer2ID = setTimeout(()=>{
        this.sounds[frame].play((success) => {
          if (success) {
            this.setState({scrollEnabled:true,speaking:false});
          } else {
            this.setState({scrollEnabled:true,speaking:false});
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
    //Back button can be pressed while speaking
    const backAction = NavigationActions.back({});
    this.props.navigation.dispatch(backAction);
  }

  handleImageViewScroll(e) {
    const x = e.contentOffset.x;
    const leftBorderFrame = Math.floor(x/imageWidth);
    const approachingFrame = Math.floor(x/imageWidth+Environment.delta);
    const signedOffset = ((x+imageWidth/2)%imageWidth-imageWidth/2)/imageWidth;//relative distance from border
    const offset = Math.abs(signedOffset);
    
    if (offset < Environment.delta) {
      this.setState({
          activeFrame:approachingFrame,
      });
    }
  }
  
  onLayout(e) {
    const {width, height} = Dimensions.get('window');
    this.setState({orientation:getOrientation()});
    this.setState({logtext:getOrientation()})
  }

  render() {
    //StatusBar.setBarStyle('light-content');
    return (
     <View style={[styles.container]} onLayout={this.onLayout.bind(this)}>
        <View style={[styles.left]}>
          <View style={[styles.leftVerticalPlaceholder]}></View>
          <BackButton 
            onBackButtonPress={this.handleBackButtonPress} 
            orientation={this.state.orientation} 
            renderIf={'LANDSCAPE'}
          />
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
              
            <BackButton 
              onBackButtonPress={this.handleBackButtonPress}
              orientation={this.state.orientation} 
              renderIf={'PORTRAIT'} 
            />
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
    this.props.onImageViewScroll(e.nativeEvent);
  }
      
  forcedScrollChild(frame) {
    this._scrollView.scrollTo({x: frame*imageWidth, y: 0, animated: Environment.animateForcedScroll})
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
    if (this.props.renderIf===this.props.orientation || this.props.renderIf==='ALWAYS') {      
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
            let opacity=0.3;
            let activeOpacity=1;
            let showSpeakerCurrent=false;
            if (i===this.props.frame) {
              opacity=1.0;
              activeOpacity=0.6;
              showSpeakerCurrent=this.props.showSpeaker;
            }
            return (
              <TouchableOpacity 
                key={i} 
                onPress={(e) => this.handlePress(e, i)} 
                activeOpacity={activeOpacity}
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
      return <Text style={{ color: 'white', fontFamily: 'Courier' }}>{this.props.text}</Text>
    } else {
      return null;
    }
  }
}

class StartScreen extends React.Component {
  static navigationOptions = {
    title: 'Välj bok',
    //header: null, use headerMode instead
  };
  
  constructor(props) {
    super(props);
    this.state = {
      orientation:getOrientation(),
    }
    this.handleImagePress = this.handleImagePress.bind(this);
    this.handleTitlePress = this.handleTitlePress.bind(this);
  }
  
  onLayout(e) {
    const {width, height} = Dimensions.get('window');
    this.setState({orientation:getOrientation()});
  }
  
  handleImagePress(book) {
    const { navigate } = this.props.navigation;
    navigate('Main',{ book: book })
  }

  handleTitlePress() {
    const { navigate } = this.props.navigation;
    navigate('Credits');
    //throw 'Controlled testing error'; //force app to error state    
  }


  render() {
    if (Environment.platform==='android') {
      StatusBar.setBackgroundColor('black');
      StatusBar.setBarStyle('light-content');
    }
    if (this.state.orientation=='LANDSCAPE') {
      return (
        <View style={[styles.landscapeStartContainer]} onLayout={this.onLayout.bind(this)}>
          <View style={[styles.landscapeStartSubContainer]}>
            <View style={[styles.landscapeStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={0} width={imageButtonImageMaxHeightLandscape}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={1} width={imageButtonImageMaxHeightLandscape}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={2} width={imageButtonImageMaxHeightLandscape}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={3} width={imageButtonImageMaxHeightLandscape}></ImageButton>
            </View>
            <View style={[styles.landscapeStartMainTitle]}>
                <TitleTextCustomFont onTitlePress={this.handleTitlePress} source={Assets.mainTitleImage} height={titleTextHeightLandscape}/>
            </View>
            <View style={[styles.landscapeStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={4} width={imageButtonImageMaxHeightLandscape}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={5} width={imageButtonImageMaxHeightLandscape}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={6} width={imageButtonImageMaxHeightLandscape}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={7} width={imageButtonImageMaxHeightLandscape}></ImageButton>
            </View>
          </View>
        </View>
      )
    } else { //PORTRAIT
      return (
        <View style={[styles.portraitStartContainer]} onLayout={this.onLayout.bind(this)}>
          <View style={[styles.portraitStartSubContainer]}>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={0} width={imageButtonImageMaxHeightPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={1} width={imageButtonImageMaxHeightPortrait}></ImageButton>
            </View>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={2} width={imageButtonImageMaxHeightPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={3} width={imageButtonImageMaxHeightPortrait}></ImageButton>
            </View>
            <View style={[styles.portraitStartMainTitle]}>
              <TitleTextCustomFont onTitlePress={this.handleTitlePress} source={Assets.mainTitleImage} height={titleTextHeightPortrait}/>
            </View>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={4} width={imageButtonImageMaxHeightPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={5} width={imageButtonImageMaxHeightPortrait}></ImageButton>
            </View>
            <View style={[styles.portraitStartImageBlock]}>
              <ImageButton onImagePress={this.handleImagePress} bookNo={6} width={imageButtonImageMaxHeightPortrait}></ImageButton>
              <ImageButton onImagePress={this.handleImagePress} bookNo={7} width={imageButtonImageMaxHeightPortrait}></ImageButton>
            </View>
          </View>
        </View>
      );
    }
  }
}

class TitleTextCustomFont extends React.Component {
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
        <Text 
          style={[styles.titleTextCustomFont,{height:this.props.height}]} 
          resizeMode = {'contain'} 
        >
          {Assets.mainTitleText}
        </Text>
      </TouchableOpacity>
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
        <Image 
          style={[styles.imageButtonImage,{width:this.props.width,height:this.props.width}]} 
          resizeMode = {'contain'} 
          source={this.src}
        >
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

class Credits extends React.Component {
  static navigationOptions = {
    title: 'Om böckerna',
    headerStyle: styles.creditsNavigator,
  };
  
  constructor(props) {
    super(props);
    
    // this.state = {
    //   orientation:getOrientation(),
    // }
    this.handleLinkPress = this.handleLinkPress.bind(this);
    this.handleBackButtonPress = this.handleBackButtonPress.bind(this);
    
  }
  
  handleLinkPress(e,url) {
     //url="http://asynkronix.se";
     Linking.openURL(url).catch(err => console.error('An error occurred', err));
    
  }
  
  handleBackButtonPress() {
    //Back button can be pressed while speaking
    const backAction = NavigationActions.back({});
    this.props.navigation.dispatch(backAction);
  }
  
  
  onLayout() {
    
  }
  
  render () {    
    //xxx layout ej klar
    return (
      
      
      
        <View style={[styles.landscapeStartContainer]} onLayout={this.onLayout.bind(this)}>
          <View style={[styles.landscapeStartSubContainer]}>
      <View style={[styles.creditsContainer]}>
      
        <Text style={[styles.creditsText]}>Så gör man - Layout ej klar!</Text>
        <Text>Så gör man är ett läromedel av Ann Gomér, BonaSignum med illustrationer av Carolina Ståhlberg. Appen är utvecklad i samarbete med Asynkronix</Text>
      <TouchableOpacity
        onPress={(e) => this.handleLinkPress(e,'http://bonasignum.se')}
        > 
        <Text>bonasignum.se</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={(e) => this.handleLinkPress(e,'http://asynkronix.se')}
      > 
        <Text>asynkronix.se</Text>
      </TouchableOpacity>
      <BackButton 
        onBackButtonPress={this.handleBackButtonPress} 
        //orientation={this.state.orientation} 
        renderIf={'ALWAYS'}
      />
        

      </View>
      </View>
      </View>
    );
  };
}

const MainNavigator = StackNavigator(
  {
    Start: { screen: StartScreen },
    Main: { screen: MainView },
    Credits: { screen: Credits }
  },{
    headerMode:'none'
  }
);

AppRegistry.registerComponent('Flyg', () => MainNavigator);
