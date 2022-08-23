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

```
npm install -D laravel-mix-email
```

Also see [Laravel Mix installation](https://laravel-mix.com/docs/6.0/installation).

## Usage

```js
// webpack.mix.js

const mix = require("laravel-mix");
require("laravel-mix-email");

mix.email({
  enabled: mix.inProduction(),
  source: "dist/**/*.html",

  inlineCss: {
    enabled: true,

    // Automattic/juice config
    // https://github.com/Automattic/juice#options
  },

  optimize: {
    enabled: true,

    // codsen/email-comb config
    // https://codsen.com/os/email-comb#api---comb
  },

  beautify: {
    enabled: false,

    // beautify-web/js-beautify config
    // https://github.com/beautify-web/js-beautify#options
  },
});
```

A more realistic example:

```js
// webpack.mix.js

const mix = require("laravel-mix");
require("laravel-mix-email");
const publicPath = "dist";

mix.setPublicPath(publicPath)
  .css("css/main.css", "css")
  .options({
    // CSS URL Rewriting: https://laravel-mix.com/docs/6.0/url-rewriting
    processCssUrls: false,

    // Disable default CSS minification - not email friendly
    cssNano: false,

    // load some postCSS plugins and write modern CSS 🚀
    postCss: [
      require("postcss-custom-properties")({ preserve: false }),
      require("postcss-logical")({ preserve: false }),
      require("postcss-dir-pseudo-class")({ preserve: false }),
    ],
  })
  .email({
    source: `${publicPath}/**/*.html`,

    inlineCss: {
      enabled: true,
      webResources: {
        relativeTo: publicPath,
      }
    },

    optimize: {
      enabled: true,

      "whitelist": [
        '.x_*', '.ReadMsgBody',
      ],

      "uglify": false,
      "removeHTMLComments": true,
      "removeCSSComments": true,

      "htmlCrushOpts": {
        "removeLineBreaks": true,
        "removeIndentations": true,
        "removeHTMLComments": true,
        "removeCSSComments": true,
        "lineLengthLimit": 500
      },
    },
  });
```

## Execution order

The plugin processes a HTML file in this order:

1. CSS inlining
2. Optimization
3. Formatting

## Why include a formatter?

Why not? If you are minifying the HTML, you don't need to use the formatter (it doesn't make sense to do so).