# coffee-build v2.0.0

Compile your `.coffee` files while sharing `coffeescript`
versions between your packages.

- Auto-installs missing versions
- Keeps versions in the `~/.coffee` directory

## Developer guide

```sh
npm i -g coffee-build
```

I recommend using `coffee-build` as a "prepublish" script.

```json
"scripts": {
  "build": "coffee-build src -o lib",
  "prepublish": "npm run build"
},
"devDependencies": {
  "coffeescript": "^2.2.0"
}
```

Include `-m` if you want sourcemaps.
