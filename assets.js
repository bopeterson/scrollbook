const _Assets = {
  mainTitleImage: require('./img/maintitle.png'),
  mainBookName: 'plane', //number of frames in this book defines the size of the indicators
  bookOrder: [
    'plane',
    'train',
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
    funeral: require('./img/funeralicon1312.png'),
    doctor: require('./img/doctoricon1312.png'),
    train: require('./img/trainicon1312.png'),
    dentist: require('./img/dentisticon1312.png'),
    plane: require('./img/planeicon1312.png'),
    restaurant: require('./img/restauranticon1312.png'),
    shop: require('./img/shopicon1312.png'),
    swim: require('./img/swimicon1312.png'),
  },
  images: {
    plane: [
      require('./img/planetitle.png'),
      require('./img/plane1.png'),
      require('./img/plane2.png'),
      require('./img/plane3.png'),
      require('./img/plane4.png'),
      require('./img/plane5.png'),
    ],
    train: [
      require('./img/traintitle.png'),
      require('./img/train1.png'),
      require('./img/train2.png'),
      require('./img/train3.png'),
      require('./img/train4.png'),
      require('./img/train5.png'),
    ],
    dentist: [
      require('./img/dentisttitle.png'),
      require('./img/dentist1.png'),
      require('./img/dentist2.png'),
      require('./img/dentist3.png'),
      require('./img/dentist4.png'),
      require('./img/dentist5.png'),
    ],
    funeral: [
      require('./img/funeraltitle.png'),
      require('./img/funeral1.png'),
      require('./img/funeral2.png'),
      require('./img/funeral3.png'),
      require('./img/funeral4.png'),
      require('./img/funeral5.png'),
    ],
    restaurant: [
      require('./img/restauranttitle.png'),
      require('./img/restaurant1.png'),
      require('./img/restaurant2.png'),
      require('./img/restaurant3.png'),
      require('./img/restaurant4.png'),
      require('./img/restaurant5.png'),
    ],
    shop: [
      require('./img/shoptitle.png'),
      require('./img/shop1.png'),
      require('./img/shop2.png'),
      require('./img/shop3.png'),
      require('./img/shop4.png'),
      require('./img/shop5.png'),
    ],
    swim: [
      require('./img/swimtitle.png'),
      require('./img/swim1.png'),
      require('./img/swim2.png'),
      require('./img/swim3.png'),
      require('./img/swim4.png'),
      require('./img/swim5.png'),
    ],
    doctor: [
      require('./img/doctortitle.png'),
      require('./img/doctor1.png'),
      require('./img/doctor2.png'),
      require('./img/doctor3.png'),
      require('./img/doctor4.png'),
      require('./img/doctor5.png'),
    ],
  },
  soundFiles: {
    plane:   [
      'tada.mp3', //only used while testing
      'plane1.mp3',
      'plane2.mp3',
      'plane3.mp3',
      'plane4.mp3',
      'xplane5.mp3',
    ],
    train:   [
      'tada.mp3', //only used while testing
      'train1.mp3',
      'train2.mp3',
      'train3.mp3',
      'train4.mp3',
      'train5.mp3',
    ],
    dentist: [
      'tada.mp3', //only used while testing
      'dentist1.mp3',
      'dentist2.mp3',
      'dentist3.mp3',
      'dentist4.mp3',
      'dentist5.mp3',
    ],
    funeral: [
      'tada.mp3', //only used while testing
      'funeral1.mp3',
      'funeral2.mp3',
      'funeral3.mp3',
      'funeral4.mp3',
      'funeral5.mp3',
    ],
    restaurant: [
      'tada.mp3', //only used while testing
      'restaurant1.mp3',
      'restaurant2.mp3',
      'restaurant3.mp3',
      'restaurant4.mp3',
      'restaurant5.mp3',
    ],
    shop: [
      'tada.mp3', //only used while testing
      'shop1.mp3',
      'shop2.mp3',
      'shop3.mp3',
      'shop4.mp3',
      'shop5.mp3',
    ],
    swim: [
      'tada.mp3', //only used while testing
      'swim1.mp3',
      'swim2.mp3',
      'swim3.mp3',
      'swim4.mp3',
      'swim5.mp3',
    ],
    doctor: [
      'tada.mp3', //only used while testing
      'doctor1.mp3',
      'doctor2.mp3',
      'doctor3.mp3',
      'doctor4.mp3',
      'doctor5.mp3',
    ],
  },

  speakerIcon: require('./img/speaker256x256.png'),
  backIcon: require('./img/home240x240transp.png'),
};

const Assets = _Assets;
module.exports = Assets;
