var _Environments = {
  ios: {
    playDelay: 200, //milliseconds, 
    delta: 0.25, //should not exeed 0.3
    deceleration: 'fast', 
    animateForcedScroll: true,
    aspectRatio: (13.0/12.0), // w / h 
    imageSideSpace: 1.03, //add some extra space left and right of image 
    imagereduction: 0.8,
    scrollThrottle: 16, //1 is tested, 16 is almost tested xxx
    gradualLoad: true,
    allowSwipeOutsideImage: true,
  },
  android: {
    
  }
  
};

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)
    //var platform = getPlatform()
    //import {Platform} from 'react-native'; console.log(Platform);
    // ...now return the correct environment
    //return _Environments[platform]
    return _Environments.ios;
}

var Environment = getEnvironment();
module.exports = Environment;

