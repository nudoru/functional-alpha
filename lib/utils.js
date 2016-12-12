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

const tryCatch = f => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

module.exports = {Right, Left, fromNullable, tryCatch};

// const findColor = name =>
//   fromNullable({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'}[name])

// const res = findColor('blue')
//             .map(c => c.slice(1))
//             .map(c => c.toUpperCase())
//             .fold(e => 'no color', x => x)

// const getPort = () =>
//   tryCatch(() => fs.readFileSync('config.json'))
//   .chain(c => tryCatch(() => JSON.parse(c)))
//   .fold(e => 3000, c => c.port)