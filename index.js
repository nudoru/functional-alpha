let util = require('util'),
    futurize = require('futurize').futurize,
    futurizeP = require('futurize').futurizeP,
    Future = require('ramda-fantasy').Future,
    Task = require('data.task'),
    {List, Map} = require('immutable-ext'),
    {curry, prop,map} = require('ramda'),
    simpleData = [{id:'0', name:'Widget 1'},
                  {id:'1', name:'Widget 2'},
                  {id:'2', name:'Widget 3'},
                  {id:'3', name:'Widget 4'},
                  {id:'4', name:'Widget 5'}],
    complexData = {
                  result: "SUCCESS",
                  interfaceVersion: "1.0.3",
                  requested: "10/17/2013 15:31:20",
                  lastUpdated: "10/16/2013 10:52:39",
                  tasks: [
                      {id: 104, complete: false,            priority: "high",
                                dueDate: "2013-11-29",      username: "Scott",
                                title: "Do something",      created: "9/22/2013"},
                      {id: 105, complete: false,            priority: "medium",
                                dueDate: "2013-11-22",      username: "Lena",
                                title: "Do something else", created: "9/22/2013"},
                      {id: 107, complete: true,             priority: "high",
                                dueDate: "2013-11-22",      username: "Mike",
                                title: "Fix the foo",       created: "9/22/2013"},
                      {id: 108, complete: false,            priority: "low",
                                dueDate: "2013-11-15",      username: "Punam",
                                title: "Adjust the bar",    created: "9/25/2013"},
                      {id: 110, complete: false,            priority: "medium",
                                dueDate: "2013-11-15",      username: "Scott",
                                title: "Rename everything", created: "10/2/2013"},
                      {id: 112, complete: true,             priority: "high",
                                dueDate: "2013-11-27",      username: "Lena",
                                title: "Alter all quuxes",  created: "10/5/2013"}]
                    };

//------------------------------------------------------------------------------
// Test curry

// Using Ramda functions
// http://fr.umio.us/why-ramda/
console.log(simpleData.map(prop('id')))
const getIds = map(prop('id'));
console.log(getIds(simpleData));

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

const getValuePromise = (value, succeed=true) => {
  return new Promise((resolve, reject) => {
    if(succeed) {
      setTimeout(() => {
        console.log('resolve',value);
        resolve({foo:value})
      }, 250);
    } else {
      reject('Some error getting '+value);
    }
  })
};


// Task([Task(Promise)],[Task(Promise)],[Task(Promise)]) ??
const asyncPromise = new Task((rej, res) => getValuePromise('p Hello').then(res).catch(rej))
      .chain((resp) => new Task((rej, res) => getValuePromise(resp).then(res).catch(rej)))
      .chain((resp) => new Task((rej, res) => getValuePromise(resp).then(res).catch(rej)));

// asyncPromise.fork(console.warn, s => console.log('Task[Promise] -> ',s));


const getValueTask = (value, succeed=true) => {
  return new Task((reject, resolve) => {
    if(succeed) {
      setTimeout(() => {
        console.log('resolve',value);
        resolve({foo:value})
      }, 250);
    } else {
      reject('Some error getting '+value);
    }
  })
};

// Task([Task(Task)],[Task(Task)],[Task(Task)])
const asyncTask = new Task((rej, res) => getValueTask('T Hello').fork(rej, res))
      .chain((resp) => new Task((rej, res) => getValueTask(resp).fork(rej, res)))
      .chain((resp) => new Task((rej, res) => getValueTask(resp).fork(rej, res)));

// asyncTask.fork(console.warn, s => console.log('Task[Task] -> ',s));

// Will generate error if 2nd arg of tranverse isn't a monad
// map isn't a function ...
// index.js:28 f(x).map(x => y => y.concat([x])).ap(ys), point(List()))
const asyncTask2 = List.of('promise3','promise2','promise1')
  .traverse(Task.of, getValueTask)

// asyncTask2.fork(console.warn, r => console.log(r.toJS()));

//------------------------------------------------------------------------------
// Example monad

/*
const Maybe = x =>
({
  x,
  concat: ({x: y}) => Maybe(x + y),
  inspect: () => `Maybe(${x})`,
  of: () => Maybe(x),
  isNothing: () => (x === null || x === undefined),
  map: (f) => {
    if(isNothing()) return Maybe.of(null);
    return Maybe.of(f(x));
  },
  join: () => x,
  chain: (f) => map(f).join,
  orElse: (d) => {
    if(isNothing()) return Maybe.of(d);
    return this;
  },
  ap: (m) => m.map(x)
});
*/