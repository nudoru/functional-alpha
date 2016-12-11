const { Right, Left } = require('data.either')
const { List } = require('immutable-ext')

const Sum = x =>
({
  x,
  concat: ({x: y}) => Sum(x + y),
  inspect: () => `Sum(${x})`
})

Sum.empty = () => Sum(0)

const Product = x =>
({
  x,
  concat: ({x: y}) => Product(x * y),
  inspect: () => `Product(${x})`
})

Product.empty = () => Product(1)

const Any = x =>
({
  x,
  concat: ({x: y}) => Any(x || y),
  inspect: () => `Any(${x})`
})

Any.empty = () => Any(false)


const All = x =>
({
  x,
  concat: ({x: y}) => All(x && y),
  inspect: () => `All(${x})`
})

All.empty = () => All(true)


const Max = x =>
({
  x,
  concat: ({x: y}) => Max(x > y ? x : y),
  inspect: () => `Max(${x})`
})

Max.empty = () => Max(-Infinity)

const Min = x =>
({
  x,
  concat: ({x: y}) => Min(x < y ? x : y),
  inspect: () => `Min(${x})`
})

Min.empty = () => Min(Infinity)

const Pair = (x, y) =>
({
  x,
  y,
  concat: ({x: x1, y: y1}) =>
    Pair(x.concat(x1), y.concat(y1)),
  inspect: () => `Pair(${x}, ${y})`
})


// monoid that keeps the first Right
const First = x =>
({
  fold: f => f(x),
  concat: o =>
    x.isLeft ? o : First(x)
})

First.empty = First(Left())

const find = (xs, f) =>
  List(xs)
  .foldMap(x => First(f(x) ? Right(x) : Left()), First.empty)
  .fold(x => x)

find([3,4,5,6,7], x => x > 4)
// Right(5)


const stats = List.of({page: 'Home', views: 40},
                      {page: 'About', views: 10},
                      {page: 'Blog', views: null})

stats.foldMap(x =>
  fromNullable(x.views).map(Sum), Right(Sum(0)))
// Right(Sum(54))


const Fn = f =>
({
  fold: f,
  concat: o =>
    Fn(x => f(x).concat(o.fold(x)))
})

const hasVowels = x => !!x.match(/[aeiou]/ig)
const longWord = x => x.length >= 5

const both = Fn(compose(All, hasVowels))
             .concat(Fn(compose(All, longWord)))

['gym', 'bird', 'lilac']
.filter(x => both.fold(x).x)
// [lilac]