const fs = require('fs');
const inflector = require('inflected');

const toCamelCase = (name) => inflector.camelize(name);

const getFieldNames = (fields) => fields.map(field => field.split(':')[0])

const toSnakeCase = (name) => inflector.underscore(name);

const toSnakeCasePlural = (name) => inflector.pluralize(toSnakeCase(name));

const toCamelCasePlural = (name) => inflector.pluralize(toCamelCase(name));

const capitalize = (name) => inflector.capitalize(name)

const toTitle = (name) =>
  inflector.underscore(name)
    .split('_')
    .map((name, idx, array) => {
      if (idx === array.length - 1) {
        return inflector.pluralize(inflector.capitalize(name));
      } else {
        return inflector.capitalize(name);
      }
    })
    .join(' ')

const writeControllerFile = (fileName, content) => {
  const destination = './app/controllers/admin';
  const filePath = `${destination}/${fileName}`;

  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
};

const writeViewFile = (viewDirName, fileName, content) => {
  const adminDestination = `./app/views/admin`;
  const destination = `${adminDestination}/${viewDirName}`;
  const filePath = `${destination}/${fileName}`;

  fs.mkdirSync(adminDestination, { recursive: true });
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
};

module.exports = {
  toCamelCase,
  toSnakeCase,
  getFieldNames,
  toSnakeCasePlural,
  toTitle,
  writeControllerFile,
  writeViewFile,
  capitalize,
  toCamelCasePlural
};
