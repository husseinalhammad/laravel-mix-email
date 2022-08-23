# laravel-mix-email

A configurable [Laravel Mix](https://laravel-mix.com/) plugin for managing common HTML email development tasks. It can be used to:

- inline CSS
- remove unused CSS
- uglify class/id names
- minify OR format the HTML/CSS

The plugin does the above using the following packages:

1. [Automattic/juice](https://github.com/Automattic/juice) for CSS inlining
2. [codsen/email-comb](https://github.com/codsen/codsen/tree/main/packages/email-comb) for HTML optimisation (remove unused CSS, uglify class/id names, minify HTML)
3. [beautify-web/js-beautify](https://github.com/beautify-web/js-beautify) for HTML/CSS formatting

## Installation

TBD

## Usage

```js
mix.email({
  source: 'dist',

  inlineCss: {
    enabled: true,

    // Automattic/juice config
  },

  optimize: {
    enabled: true,

    // codsen/email-comb config
  },

  beautify: {
    enabled: false,

    // beautify-web/js-beautify config
  }
})
```
