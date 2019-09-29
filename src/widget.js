const fs = require('fs');
var colors = require('colors');
const inflector = require('inflected');
const blabber = require('./blabber');

const getIdentifier = (name) => `${inflector.camelize(name)}Widget`;

const getTitle = (name) => inflector.humanize(inflector.underscore(name));

const getFields = (fields) => {
  return fields.map((field) => {
    const [name, type] = field.split(':');

    return [
      name,
      {
        name,
        type,
        json: getJSONDefinition(type)
      }
    ]
  }).reduce((acc, current) => {
    acc[current[0]] = current[1];

    return acc;
  }, {})
};

const getFieldsList = (fields) => Object.keys(getFields(fields));

const getJSONSelect = (type) => {
  const options = type.replace('select[', '').replace(']', '').split('/').map(o => [o, inflector.humanize(o)]);

  return {
    type: 'select',
    options,
  }
};

const getJSONDefinition = (type) => {
  if (type.indexOf('select[') !== -1) {
    return getJSONSelect(type);
  }

  return { type };
};

const getDefaults = (fields) => Object.values(getFields(fields)).map((f) => `  ${f.name}: '',`);

const getAdminFields = (fields) => Object.values(getFields(fields)).map(f => `  ${f.name}: ${JSON.stringify(f.json)},`);

const template = (identifier, fields) => (`
import React from 'react';
import { Container } from '@raketa-cms/raketa-cms';

const ${getIdentifier(identifier)} = ({ ${getFieldsList(fields).join(', ')}, containerSettings }) => (
  <Container settings={containerSettings}>
    ${getTitle(identifier)}
  </Container>
);

${getIdentifier(identifier)}.title = '${getTitle(identifier)}';
${getIdentifier(identifier)}.category = '';
${getIdentifier(identifier)}.primaryField = '${getFieldsList(fields)[0]}';

${getIdentifier(identifier)}.defaults = {
${getDefaults(fields).join('\n')}
  containerSettings: {},
};

${getIdentifier(identifier)}.adminFields = {
${getAdminFields(fields).join('\n')}
};

export default ${getIdentifier(identifier)};
`);

module.exports = (name, fields) => {
  console.log(`Generating widget for ${name}...`.yellow);
  console.log(blabber());

  const identifier = getIdentifier(name);
  const result = template(name, fields);

  // Write widget file
  const destination = './widgets';
  const widgetFile = `${destination}/${identifier}.js`;
  const libraryFile = `${destination}/index.js`;

  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(widgetFile, result, 'utf8');

  // Update library file
  const index = fs.readFileSync(libraryFile, { encoding: 'utf8' });

  if (index.indexOf(`import ${identifier} `) === -1) {
    const [imports, exports] = index.replace('};\n', '').split('export default {\n');

    const indexResult = `${imports.slice(0, -1)}import ${identifier} from './${identifier};'

export default {
${exports}  ${identifier},
}
`;
    fs.writeFileSync(libraryFile, indexResult, 'utf8');
  }

  console.log(`🚀 Done! Generated in ${widgetFile}`);
};