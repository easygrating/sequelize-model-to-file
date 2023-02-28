# model-to-file

Exports [Sequelize](https://sequelize.org) models from JavaScript to other high level programming language class files such as TypeScript and Python.

## Example

```bash
model-to-file --model Province --extension ts
```

will output `Province.ts` file

```ts
class Province {
    id: number;
    name: string;
    code: string;
    latitude: string;
    longitude: string;
    createdAt: Date;
    updatedAt: Date;
    Municipalities: Municipality[];
}
```

## Options

| Option               | Alias             | Description                                                         |
| -------------------- | ----------------- | ------------------------------------------------------------------- |
| model                | m                 | The name of the model you want to export                                 |
| extension (optional) | e                 | File/language extension for the output class file. Defaults to `.ts`. Supports `ts`, `js`, `py` and `cs`. |
| path (optional)      | p, sequelize-path | Path to the [Sequelize](https://sequelize.org) index.js file. By default `./models/index.js` |

## Install

Install it as a global package

```bash
npm install model-to-file -g
```
