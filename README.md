
# coffee-build v1.1.0

> Transpile .coffee using a specific version of `coffee-script`

#### 1. Add these 2 scripts to your `package.json`:

```json
{
  "name": "my-coffee-module",
  "scripts": {
    "build": "coffee-build -v 1.11.x -b -o js src",
    "postinstall": "npm run build"
  }
}
```

#### 2. Users of your module must globally install `coffee-build`:

```sh
[sudo] npm install -g coffee-build
```

#### 3. Add your destination directory to `.gitignore`:

```
js/
```

#### 4. Done!

Now when users install your module, the "postinstall" phase will transpile your source files (using a specific version of `coffee-script`)!

Enjoy!
