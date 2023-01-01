## Lulla Web 
This is a Lulla web version project.
https://web.lulla.co.kr


## Menu UI
TBU : image (@lulla)
[Document]() (@lulla)


## Getting Started 
Project is based on Next JS
Please refer to [Learn Next.js](https://nextjs.org/learn).

### Dev
Please run with dev option.

```bash
npm install
npm run dev
```

### Prod 
Run below commands in local or please run Dockerfile to check product version in local. 

- Run from commands

```bash
npm install 
npm start 
```

- Run from a docker
```

```

<details>
<summary>Troubleshooting</h3></summary>

[Development Notes (TBU)]()

1. Depdencies resolving issue  
: While npm installing, resolve denpendency issues can occur between packages.

- Error example
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! 
npm ERR! While resolving: learn-starter@0.1.0
npm ERR! Found: react@17.0.2
npm ERR! node_modules/react
npm ERR!   react@"17.0.2" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
```

- Solution
Install errorable packages by command with `--legacy-peer-deps` option

```bash
npm install --save {package name} --legacy-peer-deps
```

</details>




## Deployment

[Deployment info]()
