//


const getPromise = () => {
(new Promise((resolve, reject) => {
  let test = false;
  if(test) {
    resolve({foo:'bar'});
  } else {
    reject('Some error');
  }
};)
  )
}

// 1 - wrap promise in a https://github.com/futurize/futurize
// Get future w/ a maybe or either
// handle left and right