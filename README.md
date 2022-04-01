# model-to-file

Exports sequelize models to javascript/typescript class file

## Example

```
$ model-to-file --model Province --extension ts
```

will output Province.ts file

```
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
| model                | m                 | The model's name you want to export                                 |
| extension (optional) | e                 | File extension to save. Default `.ts`. Supported extension (`ts`, `js`) |
| path (optional)      | p, sequelize-path | Path to the index.js sequelize file. By default `./models/index.js` |
| export (optional)    | export-class      | Include `export` statement. Default value `false`                   |

## Install

Install it as a global package

```
npm install model-to-file -g
```
