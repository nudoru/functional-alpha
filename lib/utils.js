
//const add = uncurry(x => y => x + y);
//http://disq.us/p/16dkkq9
const uncurry = f => (...args) => args.reduce((g, x) => g(x), f);


const Right = x =>
({
  chain: f => f(x),
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`
})

const Left = x =>
({
  chain: f => Left(x),
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`
})

const fromNullable = x =>
  x != null ? Right(x) : Left(null)


// const getPort = () =>
//   tryCatch(() => fs.readFileSync('config.json'))
//   .chain(c => tryCatch(() => JSON.parse(c)))
//   .fold(e => 3000, c => c.port)
const tryCatch = f => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

module.exports = {Right, Left, fromNullable, tryCatch};