/**
  * @param {('red'|'yellow'|'green')} color
  * @returns {void}
  */
function colorLogFactory (color) {
  let colorCode = ''
  const resetColor =  '\x1b[0m'
  switch (color) {
    case 'red':
      colorCode = '\x1b[31m'
      break
    case 'yellow':
      colorCode = '\x1b[33m'
      break
    case 'green':
      colorCode = '\x1b[32m'
      break
  }
  return function () {
    console.log(...Object.values(arguments).map(a  => {
      if(typeof a === 'string') {
        return colorCode + a + resetColor;
      }
      return a
    }));
  }
}

console.log({hello:'world'})
const red = colorLogFactory('red')
red('red', 'red 2')

const yellow = colorLogFactory('yellow')
yellow('yellow', 'yellow'.split(''))

const green = colorLogFactory('green')
green('green', { hello: 'world' })
console.log({hello:'world'})
