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

/**
 * generating pins for each object
 * @param {object} realEstate object
 * @param {element} template for realEstate object pin
 */
window.generateRealEstateDom = function (realEstate, template) {
  for (var x = 0; x < realEstate.length; x++) {
    var element = template.cloneNode(true);
    var realEstateObj = realEstate[x];
    element.setAttribute('style', 'left:' + realEstateObj.location.x + 'px; top:' + realEstateObj.location.y + 'px;');
    element.querySelector('img').setAttribute('src', realEstateObj.author.avatar);
    element.querySelector('img').setAttribute('alt', realEstateObj.offer.title);
    fragment.appendChild(element);
  }
};

/**
 * assigning proper text values to each type of real estate
 * @param {string} type of realEstate object
 * @return {string} transType - proper string that would be returned to dom
 */
var idREType = function (type) {
  var transType = '';
  switch (type) {
    case 'flat':
      transType = 'Квартира';
      break;
    case 'bungalo':
      transType = 'Бунгало';
      break;
    case 'house':
      transType = 'Дом';
      break;
    case 'palace':
      transType = 'Дворец';
      break;
    default:
      transType = 'Не указано';
  }
  return transType;
};

/**
 * generating HTML for real estate features
 * @param {array} array of real estate features from the object
 * @return {element} fragment filled with generated 'feature' elements
 */
var idREFeatures = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature', 'popup__feature--' + array[i]);
    fragment.appendChild(li);
  }
  return fragment;
};

/**
 * generating HTML for real estate features
 * @param {array} array of real estate features from the object
 * @param {element} imgEl image container element from the template
 * @return {element} fragment filled with generated 'photo' elements
 */
var idREImages = function (array, imgEl) {
  var fragment = document.createDocumentFragment();
  // carried over img element so I dont have to generate it from scratch with all the attributes and all. this way it is more flexible.
  var img = imgEl.querySelector('img');
  for (var i = 0; i < array.length; i++) {
    img.setAttribute('src', array[i]);
    fragment.appendChild(img);
  }
  return fragment;
};

window.generateCardDom = function (realEstate, template) {
  for (var x = 0; x < realEstate.length; x++) {
    var element = template.cloneNode(true);
    var realEstateObj = realEstate[x];
    var type = realEstateObj.offer.type;
    // s
    element.querySelector('.popup__title').innerText = realEstateObj.offer.title;
    element.querySelector('.popup__text--address').innerText = realEstateObj.offer.address;
    element.querySelector('.popup__text--price').innerText = realEstateObj.offer.price + '₽/ночь';
    element.querySelector('.popup__type').innerText = idREType(type);
    element.querySelector('.popup__text--capacity').innerText = realEstateObj.offer.rooms + ' комнаты для ' + realEstateObj.offer.guests + ' гостей';
    element.querySelector('.popup__text--time').innerText = 'Заезд после ' + realEstateObj.offer.checkin + ', выезд до ' + realEstateObj.offer.checkout;
    element.querySelector('.popup__description').innerText = realEstateObj.offer.description;
    element.querySelector('.popup__avatar').setAttribute('src', realEstateObj.author.avatar);
    // generating features elements in a separate function
    var features = idREFeatures(realEstateObj.offer.features);
    var featuresEl = element.querySelector('.popup__features');
    // cleaning out template values
    featuresEl.innerHTML = '';
    featuresEl.appendChild(features);
    // generating img elements in a separate function
    var photosEl = element.querySelector('.popup__photos');
    var photos = idREImages(realEstateObj.offer.photos, photosEl);
    // cleaning out template values
    photosEl.innerHTML = '';
    photosEl.appendChild(photos);

    fragment.appendChild(element);
  }
};

// calling functions

var realEstate = window.generateRealEstate();
var pinTemplt = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplt = document.querySelector('#card').content.querySelector('.map__card');
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapFilters = document.querySelector('.map__filters-container');
var fragment = document.createDocumentFragment();
window.generateRealEstateDom(realEstate, pinTemplt);
mapPins.appendChild(fragment);
window.generateCardDom(realEstate, cardTemplt);
map.insertBefore(fragment, mapFilters);


// DOM manipulation
map.classList.remove('map--faded');
