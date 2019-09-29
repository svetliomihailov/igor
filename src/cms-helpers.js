const fs = require('fs');
const inflector = require('inflected');

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

const getCSSPlural = (name) => inflector.dasherize(inflector.pluralize(inflector.underscore(name)));

const getCSSSingular = (name) => inflector.dasherize(inflector.singularize(inflector.underscore(name)));

const writeWidget = (name, fields, template) => {
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

  return widgetFile;
};

module.exports = {
  getIdentifier,
  getTitle,
  getFields,
  getFieldsList,
  getJSONSelect,
  getJSONDefinition,
  getDefaults,
  getAdminFields,
  getCSSPlural,
  getCSSSingular,
  writeWidget,
};
