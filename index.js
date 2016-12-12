let util = require('util'),
    futurize = require('futurize').futurize,
    futurizeP = require('futurize').futurizeP,
    Future = require('ramda-fantasy').Future,
    Task = require('data.task');

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

// First class map

const joeize = (name) => [name,'Joe'].join('-');

let names = ['Bob','Sarah','Todd'],
    southerize = names.map(joeize);

console.log(southerize);
