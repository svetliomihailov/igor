const blabber = require('./shared/blabber');
const { execSync } = require('child_process');

const {
  toCamelCase,
  toCamelCasePlural,
  toSnakeCase,
  toSnakeCasePlural,
  getFieldNames,
  toTitle,
  writeControllerFile,
  writeViewFile,
  capitalize,
} = require('./rails/helpers');

const modelCommand = (name, fields) => `bin/rails g model ${toSnakeCase(name)} ${fields.join(' ')}`

const getParamsPermitList = fields => getFieldNames(fields).map(name => `:${name}`).join(', ')

const controllerTemplate = (name, fields) => (`module Admin
  class ${toCamelCasePlural(name)}Controller < Admin::ResourceController
    resource ${toCamelCase(name)}, location: -> { admin_${toSnakeCasePlural(name)}_path }

    def resource_params
      params.require(:${toSnakeCase(name)}).permit(${getParamsPermitList(fields)})
    end
  end
end
`);

const formField = (fieldName) => `  <%= f.input :${fieldName} %>`
const formFields = (fields) => getFieldNames(fields).map(name => formField(name)).join(`\n`)
const formTemplate = (fields) => (`<%= simple_form_for [:admin, @resource] do |f| %>
${formFields(fields)}

  <div class="btn-toolbar">
    <button type="submit" class="btn-primary lg">Save</button>
    <%= link_to 'Cancel', resources_location, class: 'btn-secondary lg' %>
  </div>
<% end %>
`);

const primaryFieldHeader = (fieldName) => `      <th class="primary">${capitalize(fieldName).split('_').join(' ')}</th>`
const fieldHeader = (fieldName) => `      <th>${capitalize(fieldName.split('_').join(' '))}</th>`
const fieldsHeaders = (fields) => {
  return getFieldNames(fields).map((name, idx) => {
    if (idx === 0) {
      return primaryFieldHeader(name)
    } else {
      return fieldHeader(name)
    }
  }).join(`\n`)
};

const primaryFieldData = (fieldName, moduleName) => `          <td class="primary"><%= link_to record.${fieldName}, edit_admin_${toSnakeCase(moduleName)}_path(record) %></td>`
const fieldData = (fieldName) => `          <td><%= record.${fieldName} %></td>`
const fieldsData = (fields, moduleName) => {
  return getFieldNames(fields).map((name, idx) => {
    if (idx === 0) {
      return primaryFieldData(name, moduleName)
    } else {
      return fieldData(name)
    }
  }).join(`\n`)
};
const indexTemplate = (name, fields) => (`<div class="page-title">
  <h1>${toTitle(name)}</h1>
</div>

<div class="btn-toolbar">
  <%= link_to 'Create', new_admin_${toSnakeCase(name)}_path, class: 'btn-success' %>
</div>

<table class="data-grid">
  <thead>
    <tr>
${fieldsHeaders(fields)}
      <th class="actions" style="width: 200px; ">&nbsp;</th>
    </tr>
  </thead>

  <tbody>
    <% if @resources.present? %>
      <% @resources.each do |record| %>
        <tr>
${fieldsData(fields, name)}
          <td class="actions">
            <%= action_link :edit, edit_admin_${toSnakeCase(name)}_path(record) %>
            <%= action_link :delete, admin_${toSnakeCase(name)}_path(record) %>
          </td>
        </tr>
      <% end %>
    <% else %>
      <tr>
        <td colspan="3">No records.</td>
      </tr>
    <% end %>
  </tbody>
</table>

<%= will_paginate @resources if @resources.present? %>
`);

module.exports = (name, fields) => {
  console.log(`${blabber()} \n`);
  console.log(`Generating Neu Admin module ${name}...`.yellow);

  execSync(modelCommand(name, fields));

  writeControllerFile(`${toSnakeCasePlural(name)}_controller.rb`, controllerTemplate(name, fields));
  writeViewFile(toSnakeCasePlural(name), '_form.html.erb', formTemplate(fields))
  writeViewFile(toSnakeCasePlural(name), 'index.html.erb', indexTemplate(name, fields))

  console.log(`Add the following to your admin section in the router file: resources :${toSnakeCase(name)}`.green);

  console.log(`\n🚀 Done!`);
};
