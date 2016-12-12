let util = require('util'),
    futurizeP = require('futurize').futurizeP,
    Future = require('ramda-fantasy').Future;

// A test promise, if test
const getPromise = (test) => {
 return new Promise((resolve, reject) => {
  if(test) {
    resolve({foo:'bar'});
  } else {
    reject('Some error');
  }
})
};

const doSuccessPromise = () => getPromise(true);
const doFailPromise = () => getPromise(false);

// Regular Promise
doSuccessPromise().then(d => console.log('Got ',d)).catch(e => console.warn('Err ',e));

// Futurized
const future = futurizeP(Future);
const futureizedPromise = future(doSuccessPromise)
futureizedPromise().fork(e => console.warn(e), d => console.log('Got ', d));