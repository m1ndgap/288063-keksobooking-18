'use strict';

// declaring constants
var LOCATIONRANGEX = [50, 1150];
var LOCATIONRANGEY = [130, 640];
var PRICERANGE = [1500, 10000];
var TITLES = ['Красивое', 'Отличное', 'Великолепное', 'Замечательное', 'Прекрасное', 'Превосходное'];
var RETYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINTIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var REDESCRIPTION = [
  'Идеальна для семьи с детьми',
  'В нашей квартире два сан.узла и большая прихожая. Высокие трех метровые потолки Замечательная просторная, светлая планировка',
  'Потрясающее соотношение цена - качество квартиры. Квартира двухсторонняя',
  'Рядом с домом есть вся необходимая инфраструктура для жизни, отдыха и работы.',
  'Безопасность жильцов обеспечивает служба охраны, по периметру установлены камеры видеонаблюдения.',
  'Документы на квартиру проверены и подготовлены к сделке.'
];
var REPHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// declaring functions
/**
* generating random number
* @param {int} min value
* @param {int} max value
* @return {int} random number from the range
 */
var rng = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/**
 * generating random array consisting of constant array's elements
 * @param {array} array of values
 * @return {array} of random length (max length = array length) and no duplicates
 */
var generateRandomArray = function (array) {
  var localArray = array.slice();
  var features = [];
  var numberOfFeatures = rng(0, array.length);
  for (var i = 0; i < numberOfFeatures; i++) {
    var arrayNum = rng(0, localArray.length - 1);
    features.push(localArray[arrayNum]);
    localArray.splice(arrayNum, 1);
  }
  return features;
};

/**
 * generating array of objects to populate DOM
 * @return {array} of real estate objects
 */
window.generateRealEstate = function () {
  var realEstate = [];
  for (var i = 0; i < 8; i++) {
    var coordX = rng(LOCATIONRANGEX[0], LOCATIONRANGEX[1]);
    var coordY = rng(LOCATIONRANGEY[0], LOCATIONRANGEY[1]);
    var realEstateObject = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': TITLES[rng(0, TITLES.length)] + ' жилье',
        'address': coordX + ', ' + coordY,
        'price': rng(PRICERANGE[0], PRICERANGE[1]),
        'type': RETYPE[rng(0, RETYPE.length - 1)],
        'rooms': rng(1, 5),
        'guests': rng(1, 10),
        'checkin': CHECKINTIME[rng(0, CHECKINTIME.length - 1)],
        // 'checkout': CHECKINTIME[rng(0, CHECKINTIME.length)],
        'checkout': CHECKINTIME[rng(0, CHECKINTIME.length - 1)],
        'features': generateRandomArray(FEATURES),
        'description': REDESCRIPTION[rng(0, REDESCRIPTION.length - 1)],
        'photos': generateRandomArray(REPHOTOS),
      },
      'location': {
        'x': coordX,
        'y': coordY,
      },
    };
    realEstate.push(realEstateObject);
  }
  return realEstate;
};

window.generateRealEstateDom = function (realEstate, template) {
  for (var x = 0; x < realEstate.length; x++) {
    var element = template.content.querySelector('.map__pin').cloneNode(true);
    var realEstateObj = realEstate[x];
    element.setAttribute('style', 'left:' + realEstateObj.location.x + 'px; top:' + realEstateObj.location.y + 'px;');
    element.querySelector('img').setAttribute('src', realEstateObj.author.avatar);
    element.querySelector('img').setAttribute('alt', realEstateObj.offer.title);
    fragment.appendChild(element);
  }
};

// calling functions
var fragment = document.createDocumentFragment();
var templt = document.querySelector('#pin');
var mapPins = document.querySelector('.map__pins');
window.generateRealEstateDom(window.generateRealEstate(), templt);
mapPins.appendChild(fragment);

// DOM manipulation
var map = document.querySelector('.map');
map.classList.remove('map--faded');
