let util = require('util'),
    futurize = require('futurize').futurize,
    futurizeP = require('futurize').futurizeP,
    Future = require('ramda-fantasy').Future,
    Task = require('data.task');

//------------------------------------------------------------------------------
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
// doSuccessPromise().then(d => console.log('Got ',d)).catch(e => console.warn('Err ',e));

// Futurized
const future = futurizeP(Future);
const futureizedPromise = future(doSuccessPromise)
// futureizedPromise().fork(e => console.warn(e), d => console.log('Future, got ', d));

//------------------------------------------------------------------------------
// First class map

const joeize = (name) => [name,'Joe'].join('-');

let names = ['Bob','Sarah','Todd'],
    southerize = names.map(joeize);

// console.log(southerize);

//------------------------------------------------------------------------------
// Transduce

const concat = (acc, x) => acc.concat(x); // Wrap Array.concat
const mapper = (f, cnct) => (acc, x) => cnct(acc, f(x));
const filterer = (f, cnct) => (acc, x) => f(x) ? cnct(acc, x) : acc;
const transRes = [1,2,3].reduce(filterer(x => x > 1, mapper(x => x + 1, concat)), []);
// console.log(transRes);

//------------------------------------------------------------------------------
// Task

const testTask = new Task((reg, res) => res(['One', 'Two', 'Three']));
const theTasks = testTask.map(items => items); // Some op on the array
// theTasks.fork(e => console.error(e),d => console.log('Tasks ', d))

//------------------------------------------------------------------------------
// Nested tasks

const getValuePromise = (value, succeed) => {
  return new Promise((resolve, reject) => {
    if(succeed) {
      setTimeout(() => {
        console.log('Succeeded with',value);
        resolve({foo:value})
      }, 250);
    } else {
      reject('Some error getting '+value);
    }
  })
};

const asyncTask = new Task((rej, res) => getValuePromise('Hello', true).then(res).catch(rej))
      .chain((resp) => new Task((rej, res) => getValuePromise(resp, true).then(res).catch(rej)))
      .chain((resp) => new Task((rej, res) => getValuePromise(resp, true).then(res).catch(rej)));

asyncTask.fork(console.warn, console.log);
