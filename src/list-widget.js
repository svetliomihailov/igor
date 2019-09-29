const fs = require('fs');
var colors = require('colors');
const inflector = require('inflected');
const blabber = require('./blabber');

const getIdentifier = (name) => `${inflector.camelize(name)}Widget`;

const getTitle = (name) => inflector.humanize(inflector.underscore(name));

const getCSSPlural = (name) => inflector.dasherize(inflector.pluralize(inflector.underscore(name)));
const getCSSSingular = (name) => inflector.dasherize(inflector.singularize(inflector.underscore(name)));

const template = (identifier, _fields) => (`
import React from 'react';
import { Container, List, ImagePicker, TextInput, RichText, SelectMenu, LinkSettings, Img } from '@raketa-cms/raketa-cms';
import Link from '../frontend/Link';

const Item = ({ title, link, image, description }) => (
  <div className="${getCSSSingular(identifier)}">
    <Img src={image} variant="image" />

    <div className="article-content">
      <h4 className="article-title">{link ? <Link settings={link}>{title}</Link> : title}</h4>
      {description && <div dangerouslySetInnerHTML={{ __html: description }} />}
    </div>
  </div>
);

const variants = {
  2: 6,
  3: 4,
  4: 3,
};

const ${getIdentifier(identifier)} = ({ variant, list, containerSettings }) => (
  <Container settings={containerSettings}>
    <div className="${getCSSPlural(identifier)}">
      <div className="container">
        <div className="row">
          {list.map((item) =>
            <div key={item.id} className={\`col-\${variants[variant]}\`}>
              <Item {...item} />
            </div>
          )}
        </div>
      </div>
    </div>
  </Container>
);

${getIdentifier(identifier)}.title = '${getTitle(identifier)}';
${getIdentifier(identifier)}.category = '_Unspecified';

${getIdentifier(identifier)}.defaults = {
  variant: 3,
  list: [
    { id: 1, title: 'Title', link: LinkSettings.defaults, description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>', image: 'http://placehold.it/400x300' },
    { id: 2, title: 'Title', link: LinkSettings.defaults, description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>', image: 'http://placehold.it/400x300' },
    { id: 3, title: 'Title', link: LinkSettings.defaults, description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>', image: 'http://placehold.it/400x300' },
  ],
  containerSettings: {},
};

const ListItem = ({ settings, onChangeItem }) => (
  <div>
    <ImagePicker
      label="Image"
      onChange={value => onChangeItem('image', value)}
      value={settings.image}
    />

    <TextInput
      label="Title"
      onChange={value => onChangeItem('title', value)}
      value={settings.title}
    />

    <LinkSettings
      label="Link"
      onChange={value => onChangeItem('link', value)}
      value={settings.link}
    />

    <RichText
      label="Description"
      onChange={value => onChangeItem('description', value)}
      value={settings.description}
    />
  </div>
);

${getIdentifier(identifier)}.adminFields = (items, onChange, settings) => (
  <div>
    <SelectMenu
      label="Variant"
      options={[[2, 2], [3, 3], [4, 4]]}
      value={settings.variant}
      onChange={value => onChange('variant', value)}
    />

    <List
      listItem={(settings, onChangeItem) =>
        <ListItem settings={settings} onChangeItem={onChangeItem} />}
      onChangeList={onChange}
      items={items}
    />
  </div>
);

export default ${getIdentifier(identifier)};
`);

module.exports = (name, fields) => {
  console.log(`Generating list widget for ${name}...`.yellow);
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