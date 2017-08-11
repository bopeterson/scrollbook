import {
    Platform,
} from 'react-native';

const _Environments = {
  ios: {
    playDelay1: 100, //milliseconds until when scroll is locked and speaker icon shown 
    playDelay2: 500, //milliseconds until sound is played after scoll is locked
    delta: 0.25, //should not exeed 0.3
    deceleration: 'fast', 
    animateForcedScroll: true,
    aspectRatio: (13.0/12.0), // w / h 
    imageSideSpace: 1.03, //add some extra space left and right of image 
    imagereduction: 0.8,
    scrollThrottle: 16, //1 is tested, 16 is almost tested xxx
    gradualLoad: true,
    showLog: false,
    showBookTitle: true,
    buttonColor: '#fecd0b', //red '#FF5959', yellow '#f4c053', 
    textColor: '#fecd0b', //red '#FF5959', yellow '#f4c053',bonasignum: '#fecd0b'

  },
  android: {
    playDelay1: 100, //milliseconds, 
    playDelay2: 500, //milliseconds, 
    delta: 0.25, //should not exeed 0.3
    deceleration: 'fast', 
    animateForcedScroll: true,
    aspectRatio: (13.0/12.0), // w / h 
    imageSideSpace: 1.03, //add some extra space left and right of image 
    imagereduction: 0.8,
    scrollThrottle: 16, //1 is tested, 16 is almost tested xxx
    gradualLoad: true,
    showLog: false,
    showBookTitle: true,
    buttonColor: '#fecd0b', //red '#FF5959', yellow '#f4c053'
    textColor: '#fecd0b', //red '#FF5959', yellow '#f4c053'
  }
  
};

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)
    //var platform = getPlatform()
    if (Platform.OS=='ios') {
      return _Environments.ios;
    } else if (Platform.OS=='android') {
      return _Environments.android;
    } else {
      return _Environments.ios;
    }
}

const Environment = getEnvironment();
module.exports = Environment;

