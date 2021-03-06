## Installation

```
yarn global add @studioraketa/igor
```

or

```
npm i -g @studioraketa/igor
```

## Usage

```
igor widget SectionTitle title:text
igor list-widget Cards
igor page-style cart # PENDING
```

## Generators

- **widget:** generates JS and SASS code for `raketa-cms` widget with JSON map for field settings
- **list-widget:** generates JS and SASS boilerplate for `raketa-cms` widget with list structure

### `igor widget ...`

This generator creates a new raketa-cms widget and corresponding SASS file, as well as including them in their respected library indices (`widgets/index.js` and `componends/_module.scss`).

Usage:

```
igor widget WIDGET_NAME [field:type], [field:type]...
```

Examples:

```
igor widget SectionTitle title
igor widget Text variant:select[6/8] text:rich
igor widget LeadImage image:image title:text description:rich
igor widget CtaBar title:text button:button inline_theme:select[none/brand/brand-alt/green/brown/orange/lilac/blue/red]
```

Field types:

- `text`: the default
- `textarea`: generates a textarea setting
- `rich`: generates a rich editor setting
- `image`: generates an image picker setting
- `select[option1/option2/option3]`: generates a select setting and its options

**NB:** By default if you do not specify a field type, the `text` type will be used.

### `igor list-widget` ...

This generator creates a boilerplate list (you cannot specify the field options during generation, but you get a good example of all types) widget with corresponidng SASS file, as well as including them in their library indices.

Usage:

```
igor list-widget WIDGET_NAME
```

Examples:

```
igor list-widget Cards
igor list-widget Testimonials
igor list-widget Features
igor neu-admin-module ProposalRequest uid:string deadline:datetime opens_at:datetime title:string subsidiary:string content: string
```

### `igor neu-admin-module` ...

This generator creates boilerplate for the NeuAdmin module.

Run the command from within a rails project directory which uses NeuAdmin. The generator will run the
[rails commands](https://guides.rubyonrails.org/command_line.html#rails-generate) and then add the files
needed by the NeuAdmin module.

Usage:

```
igor neu-admin-module ModuleName fiel:type field:type:option
```

Examples:

```
igor neu-admin-module ProposalRequest uid:string:unique deadline:datetime opens_at:datetime title:string subsidiary:string content:string
```

## TODO

- [x] Raketa CMS (Rails)
- [x] Neu Admin (Rails)
- [ ] Raketa CMS (NextJS)
- [ ] Design System (NextJS)

## Development

1. Clone the repo and install its dependencies
1. Make sure to uninstall any global instance of igor with `npm uninstall -g igor`
1. Run `npm install -g ./` from within your local igor folder
1. Commit you changes and a version bump (in `package.json`)
1. Use yarn publish to publish the new version on NPM
