const fs = require('fs');
const blabber = require('./shared/blabber');

const { getIdentifier, getTitle, getCSSPlural, getCSSSingular, writeWidget, writeCSSList } = require('./cms/helpers');

const template = (identifier, _fields) => (`import React from 'react';
import { Container, List, TextInput, SelectMenu, LinkSettings, Img } from '@raketa-cms/raketa-cms';
import { ImagePicker } from '@raketa-cms/raketa-image-picker';
import { RichText } from '@raketa-cms/raketa-rte';
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
${getIdentifier(identifier)}.dialogSize = 'large';

${getIdentifier(identifier)}.defaults = {
  variant: 3,
  list: [
    { id: 1, link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' },
    { id: 2, link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' },
    { id: 3, link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' },
  ],
  containerSettings: {},
};

const ListItem = ({ settings, onChangeItem }) => (
  <div>
    <LinkSettings
      label="Link"
      onChange={value => onChangeItem('link', value)}
      value={settings.link}
    />

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
      options={[[2, '2 columns'], [3, '3 columns'], [4, '4 columns']]}
      value={settings.variant}
      onChange={value => onChange('variant', value)}
    />

    <List
      listItem={(settings, onChangeItem) =>
        <ListItem settings={settings} onChangeItem={onChangeItem} />}
      items={items}
      template={{ link: LinkSettings.defaults, image: 'http://placehold.it/400x300', title: 'Title', description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores distinctio ea non? Quisquam enim blanditiis deserunt cumque earum.</p>' }}
      primaryField="title"
      onChangeList={onChange}
    />
  </div>
);

export default ${getIdentifier(identifier)};
`);

module.exports = (name, fields) => {
  console.log(`${blabber()}\n`);
  console.log(`Generating list widget for ${name}...`.yellow);

  const widgetFile = writeWidget(name, fields, template);
  console.log(widgetFile.green);

  const cssFile = writeCSSList(name);
  console.log(cssFile.green);

  console.log(`\n🚀 Done!`);
};
