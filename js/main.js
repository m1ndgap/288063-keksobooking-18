var locationRangeX = [0, 704];
var locationRangeY = [130, 640];
var priceRange = [1500, 10000];

// calculating random coords for each location with rng with range
var getRandomArbitrary = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

window.generateLocations = function () {
  var locations = [];
  for (var i = 0; i < 8; i++) {
    var coordX = getRandomArbitrary(locationRangeX[0],locationRangeX[1]);
    var coordY = getRandomArbitrary(locationRangeY[0],locationRangeY[1]);
    var location = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': 'Заголовок',
        'address': coordX + ', ' + coordY,
        'price': getRandomArbitrary(priceRange[0], priceRange[1]),
        // 'type':,
        // 'rooms':,
        // 'guests':,0
        // 'checkin':,
        // 'checkout':,
        // 'features':,
        // 'description':,
        // 'photos':,
      },
      'location': {
        'x': coordX,
        'y': coordY,
      },
    };
    console.log(location['location']['x']);
    locations.push(location);
  }
  return locations;
};

console.log(generateLocations());
