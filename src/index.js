var package = require('../package.json');

exports.greet = () => {
  console.log('🤵 Hello!');
  console.log(`v${package.version}`.yellow);
};
