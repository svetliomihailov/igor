const blabber = require('./blabber');

const { getIdentifier, getTitle, getFieldsList, getDefaults, getAdminFields, writeWidget, writeCSS } = require('./cms-helpers');

const template = (identifier, fields) => (`
import React from 'react';
import { Container } from '@raketa-cms/raketa-cms';

const ${getIdentifier(identifier)} = ({ ${getFieldsList(fields).join(', ')}, containerSettings }) => (
  <Container settings={containerSettings}>
    ${getTitle(identifier)}
  </Container>
);

${getIdentifier(identifier)}.title = '${getTitle(identifier)}';
${getIdentifier(identifier)}.category = '_Unspecified';
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

  const widgetFile = writeWidget(name, fields, template);
  const cssFile = writeCSS(name);

  console.log(`🚀 Done! \n${widgetFile}\n${cssFile}`);
};