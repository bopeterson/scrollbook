//kankse byta ordning, så att plane:images istället. Eg book.name.frame[i].image book.name.frame[i].sound

/*

bra men för meckigt att ändra....kanske
ungefär så här...
books=[
  {title:'plane',
  titleimage...
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
  mainTitleImage: require('./img/maintitle.png'),
  mainBookName: 'plane', //number of frames in this book defines the size of the indicators
  bookOrder: [
    'train',
    'plane',
    'dentist',
    'funeral',
    'restaurant',
    'shop',
    'swim',
    'doctor',
  ],
  bookTitles: {    
    funeral: 'Gå på begravning',
    doctor: 'Gå till doktorn',
    train: 'Åka tåg',
    dentist: 'Gå till tandläkaren',
    plane: 'Åka flygplan',
    restaurant: 'Gå på restaurang',
    shop: 'Handla i affären',
    swim: 'På simhallen',
  },
  titleImages: {
    funeral: require('./img/titlefuneral.png'),
    doctor: require('./img/titledoctor.png'),
    train: require('./img/titletrain.png'),
    dentist: require('./img/titledentist.png'),
    plane: require('./img/titleplane.png'),
    restaurant: require('./img/titlerestaurant.png'),
    shop: require('./img/titleshop.png'),
    swim: require('./img/titleswim.png'),
  },
  images: {
    plane: [
      require('./img/titleplane.png'),
      require('./img/flyg001.jpg'),
      require('./img/flyg002.jpg'),
      require('./img/flyg003.jpg'),
      require('./img/flyg004.jpg'),
      require('./img/flyg005.jpg'),
    ],
    train: [
      require('./img/titletrain.png'),
      require('./img/titletrain.png'),
      require('./img/titletrain.png'),
      require('./img/titletrain.png'),
      require('./img/titletrain.png'),
      require('./img/titletrain.png'),
    ],
    dentist: [
      require('./img/titledentist.png'),
    ],
    funeral: [
      require('./img/titlefuneral.png'),
    ],
    restaurant: [
      require('./img/titlerestaurant.png'),
    ],
    shop: [
      require('./img/titleshop.png'),
    ],
    swim: [
      require('./img/titleswim.png'),
    ],
    doctor: [
      require('./img/titledoctor.png'),
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

  speakerIcon: require('./img/speaker256x256.png'),
  backIcon: require('./img/home240x240yellow.png'),



};

const Assets = _Assets;
module.exports = Assets;
