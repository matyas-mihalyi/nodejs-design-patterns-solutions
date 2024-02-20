class ColorConsole {
  log () {}
}

class RedConsole extends ColorConsole {
  log (str) {
    console.log('\x1b[31m', str)
  }
}

class BlueConsole extends ColorConsole {
  log (str) {
    console.log('\x1b[34m', str)
  }
}

class GreenConsole extends ColorConsole {
  log (str) {
    console.log('\x1b[32m', str)
  }
}

function consoleColorFactory (color) {
  switch (color) {
    case 'red':
      return new RedConsole()
    case 'blue':
      return new BlueConsole()
    case 'green':
      return new GreenConsole()
    default:
      throw new Error('Unsupported color: ' + color)
  }
}

function test () {
  const logger = consoleColorFactory(process.argv[2])
  logger.log(process.argv[3])
}

test()
