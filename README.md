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

**NB:** By default if you not specify field type a `text` will be used.

### `igor list-widget` ...

This generator creates a boilerplate list (you cannot specify the options, but you get a good example of all types) widget with corresponidng SASS file, as well as including them in their library indices.

Usage:

```
igor list-widget WIDGET_NAME
```

Examples:

```
igor list-widget Cards
igor list-widget Testimonials
igor list-widget Features
```

## TODO

- [x] Raketa CMS (Rails)
- [ ] Raketa CMS (NextJS)
- [ ] Design System (NextJS)
- [ ] Neu Admin (Rails)

## Development

1. Clone the repo and install its dependencies
1. Make sure to uninstall any global instance of igor with `npm uninstall -g igor`
1. Run `npm install -g ./` from within your local igor folder
1. Commit you changes and a version bump (in `package.json`)
1. Use yarn publish to publish the new version on NPM
