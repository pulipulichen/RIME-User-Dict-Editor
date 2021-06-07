/* global __dirname */

const fs = require('fs')
const { execSync } = require('child_process');

//let filename = __dirname + "/PWA-Tool.desktop"
let projectNameParts = __dirname.split('/')
let projectNameRaw = projectNameParts[(projectNameParts.length - 1)]
let projectName = projectNameRaw.split('-').join(' ')

let filename = `${__dirname}/${projectNameRaw}.desktop`
let content = `#!/usr/bin/env xdg-open
[Desktop Entry]
Version=1.0
Terminal=false
Type=Application
Name=${projectName}
Exec=npm run start-electron --prefix ${__dirname}
Icon=${__dirname}/client/img/icon/favicon.jpg
StartupWMClass=ElectronProject${projectNameRaw}`

fs.writeFileSync(filename, content)
console.log(filename)
console.log(content)

execSync(`chmod +x ${filename}`)
execSync(`mv ${filename} ~/.local/share/applications/`)