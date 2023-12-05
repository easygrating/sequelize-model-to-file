# model-to-file

Exports [Sequelize](https://sequelize.org) models to high level programming language class files such as TypeScript, JavaScript, PHP, C#, Java and Python.

## Options

| Option               | Alias             | Description                                                                                                      |
| -------------------- | ----------------- | -----------------------------------------------------------------------------------------------------------------|
| model                | m                 | The name of the model you want to export.                                                                        |
| extension (optional) | e                 | File/language extension for the output class file. Defaults to `.ts`. Supports `ts`, `js`, `py`, `php`, `java` and `cs`. |
| path (optional)      | p, sequelize-path | Path to the [Sequelize](https://sequelize.org) index.js file. By default `./models/index.js`.                    |
| help (optional)      | h, help           | Display the usage guide.                                                                                         |

## Install

Install it as a global package

```bash
npm install @easygrating/model-to-file -g
```

## Usage

Create TypeScript class from sequelize model 
```bash
@easygrating/model-to-file --model Province --extension ts
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
Create C# class from sequelize model 
```bash
@easygrating/model-to-file --model Province --extension cs
```

will output `Province.cs` file

```cs
using System;
using System.Collections.Generic;

public class Province 
{ 
	public int Id { get; set; }
	public string Name { get; set; }
	public string Code { get; set; }
	public decimal Latitude { get; set; }
	public decimal Longitude { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime UpdatedAt { get; set; }
	public List<Municipality> Municipalities { get; set; }
}
```

## Keywords

`sequelize`, `model`, `util`, `class`
