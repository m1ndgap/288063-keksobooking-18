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
var ENTERKEY = 13;
// var PINHEIGHT = 70;
var FORMOFFCLASS = 'ad-form--disabled';
var MAPOFFCLASS = 'map--faded';
var PINCLASS = 'map__pin';
var MAINPINCLASS = 'map__pin--main';
var POPUPCLASS = 'map__card';


// declaring functions
/**
 * checking if map is already populated
 * @param {element} map containing elements
 * @return {boolean} true if map has no address pins (main pin is ignored)
 */
var checkPins = function (map) {
  var pins = map.querySelectorAll('.' + PINCLASS).length;
  return !(pins > 1);
};

var destroyMapElements = function (map) {
  var pins = map.querySelectorAll('.' + PINCLASS);
  var popup = map.querySelector('.' + POPUPCLASS);
  popup.remove();
  for (var i = 0; i < pins.length; i++) {
    var pin = pins[i];
    if (!(pin.classList.contains(MAINPINCLASS))) {
      pin.remove();
    }
  }
};

/**
 * disable all form inputs
 * @param {element} form - target for disabling
 * @param {string} cls - css class disabling the form
 * @param {element} map - map element to enable
 * @param {string} mapCls - css class disabling the form
 */
var disablePage = function (form, cls, map, mapCls) {
  form.classList.add(cls);
  map.classList.add(mapCls);
  var fieldsets = form.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    var fieldset = fieldsets[i];
    fieldset.disabled = true;
  }
};

/**
 * enable the form and map
 * @param {element} form - target for disabling
 * @param {string} cls - css class disabling the form
 * @param {element} map - map element to enable
 * @param {string} mapCls - css class disabling the form
 */
var enablePage = function (form, cls, map, mapCls) {
  form.classList.remove(cls);
  map.classList.remove(mapCls);
  var fieldsets = form.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    var fieldset = fieldsets[i];
    fieldset.disabled = false;
  }
};


/**
 * fillin address input field based on our pin location and active/inactive state.
 * @param {element} pin used to determine coordinates to display
 */
var fillAddress = function (pin) {
  var addressField = document.querySelector('.ad-form #address');
  var addressX = pin.style.left.slice(0, -2);
  var addressY = pin.style.top.slice(0, -2);
  addressField.setAttribute('value', addressX + ', ' + addressY);
};

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
 * @return {element} fragment containing collection of pins to put on the map
 */
window.generateRealEstateDom = function (realEstate, template) {
  var fragment = document.createDocumentFragment();
  for (var x = 0; x < realEstate.length; x++) {
    var element = template.cloneNode(true);
    var realEstateObj = realEstate[x];
    element.setAttribute('style', 'left:' + realEstateObj.location.x + 'px; top:' + realEstateObj.location.y + 'px;');
    element.querySelector('img').setAttribute('src', realEstateObj.author.avatar);
    element.querySelector('img').setAttribute('alt', realEstateObj.offer.title);
    fragment.appendChild(element);
  }
  return fragment;
};

/**
 * assigning proper text values to each type of real estate
 * @param {string} type of realEstate object
 * @return {string} transType - proper string that would be returned to dom
 */
var idREType = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return 'Не указано';
  }
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
  for (var i = 0; i < array.length; i++) {
    var img = imgEl.querySelector('img').cloneNode();
    img.setAttribute('src', array[i]);
    fragment.appendChild(img);
  }
  return fragment;
};

window.generateCardDom = function (realEstate, template) {
  var element = template.cloneNode(true);
  var realEstateObj = realEstate[0];
  var type = realEstateObj.offer.type;
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
  return element;
};

//    calling functions
// disabling the form
var mainForm = document.querySelector('.ad-form');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var realEstate = window.generateRealEstate();
var resetEl = document.querySelector('.ad-form__reset');
disablePage(mainForm, FORMOFFCLASS, map, MAPOFFCLASS);
fillAddress(mainPin);
checkPins(map);


// assigning event listeners
mainPin.addEventListener('mousedown', function () {
  enablePage(mainForm, FORMOFFCLASS, map, MAPOFFCLASS);
  if (checkPins(map)) {
    var pinTemplt = document.querySelector('#pin').content.querySelector('.map__pin');
    var cardTemplt = document.querySelector('#card').content.querySelector('.map__card');
    var mapPins = document.querySelector('.map__pins');
    var mapFilters = document.querySelector('.map__filters-container');
    var mapPinContent = window.generateRealEstateDom(realEstate, pinTemplt);
    mapPins.appendChild(mapPinContent);
    map.insertBefore(window.generateCardDom(realEstate, cardTemplt), mapFilters);
  }
});
mainPin.addEventListener('mouseup', function () {
  fillAddress(mainPin);
});
mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTERKEY) {
    enablePage(mainForm, FORMOFFCLASS, map, MAPOFFCLASS);
    map.classList.remove('map--faded');
    fillAddress(mainPin);
  }
});
resetEl.addEventListener('click', function () {
  disablePage(mainForm, FORMOFFCLASS, map, MAPOFFCLASS);
  destroyMapElements(map);
});


mainForm.addEventListener('submit', function (evt) {
  var guests = document.querySelector('#capacity');
  var guestsNumber = guests.querySelector('option:checked').value;
  var rooms = document.querySelector('#room_number');
  var roomsNumber = rooms.querySelector('option:checked').value;
  if (guestsNumber > roomsNumber) {
    guests.setCustomValidity('Слишком много гостей');
    evt.preventDefault();
  } else {
    guests.setCustomValidity('');
  }
  evt.target.checkValidity(); // returns false but im not sure what to do with it.
});

