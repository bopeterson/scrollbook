//kankse byta ordning, så att plane:images istället. Eg book.name.frame[i].image book.name.frame[i].sound

/*

bra men för meckigt att ändra....kanske
ungefär så här...
books=[
  {title:'plane',
    assets: [
    {
      image: require('./img/flyg000.png'),
      sound: 'tada.mp3'
    },
    {
      image: require('./img/flyg001.jpg'),
      sound: 'flyg1.mp3'
    },
    {
      image: require('./img/flyg002.jpg'),
      sound: 'flyg2.mp3'
    },
    {
      image: require('./img/flyg003.jpg'),
      sound: 'flyg3.mp3'
    },
    {
      image: require('./img/flyg004.jpg'),
      sound: 'flyg4.mp3'
    },
    {
      image: require('./img/flyg005.jpg'),
      sound: 'flyg5.mp3'
    },
  
  ]
}
]
*/

const _Assets = {
  mainBookName: 'plane', //number of frames in this book defines the size of the indicators
  bookOrder: [
    'plane',
    'train',
    'dentist',
  ],
  bookTitles: {
    plane: 'Flyga',
    train: 'Åka tåg',
    dentist: 'Gå till tandläkaren',
  },
  titleImages: {
    plane: require('./img/flyg000.png'),
    train: require('./img/flyg001.jpg'),
    dentist: require('./img/flyg002.jpg'),
  },
  images: {
    plane: [
      require('./img/flyg000.png'),
      require('./img/flyg001.jpg'),
      require('./img/flyg002.jpg'),
      require('./img/flyg003.jpg'),
      require('./img/flyg004.jpg'),
      require('./img/flyg005.jpg'),
    ],
    train: [
      require('./img/flyg001.jpg'),
      require('./img/flyg001.jpg'),
      require('./img/flyg001.jpg'),
      require('./img/flyg001.jpg'),
      require('./img/flyg001.jpg'),
      require('./img/flyg001.jpg'),
      require('./img/flyg001.jpg'),
    ],
    dentist: [
      require('./img/flyg003.jpg'),
      require('./img/flyg004.jpg'),
      require('./img/flyg005.jpg'),
    ],
  },
  soundFiles: {
    plane:   [
      'tada.mp3', //only used while testing
      'flyg1.mp3',
      'flyg2.mp3',
      'flyg3.mp3',
      'flyg4.mp3',
      'flyg5.mp3',
    ],
    train:   [
      'tada.mp3', //only used while testing
      'flyg4.mp3',
      'flyg4.mp3',
      'flyg4.mp3',
      'flyg4.mp3',
      'flyg4.mp3',
      'flyg4.mp3',
    ],
    dentist:   [
      'tada.mp3', //only used while testing
      'flyg3.mp3',
      'flyg3.mp3',
    ],
  },
  
  xxxSoundFiles: [
      'tada.mp3', //only used while testing
      'flyg1.mp3',
      'flyg2.mp3',
      'flyg3.mp3',
      'flyg4.mp3',
      'flyg5.mp3',
    ],

  
  speakerIcon: require('./img/speaker256x256.png'),
  backIcon: require('./img/home240x240yellow.png'),



};

const Assets = _Assets;
module.exports = Assets;
