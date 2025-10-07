let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css')
    .copyDirectory('resources/assets/img', 'public/img')
    .copyDirectory('resources/assets/css', 'public/css')
    .copyDirectory('resources/assets/js', 'public/js')
    .copyDirectory('resources/assets/plugins', 'public/plugins')
    .version();