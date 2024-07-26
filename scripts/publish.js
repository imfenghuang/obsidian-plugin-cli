import { execSync } from 'child_process'
import fs from 'fs/promises'

function publish() {
  execSync('rm -rf ./publish')
  execSync('mkdir ./publish')
  execSync('mkdir ./publish/dist')
  execSync('cp ./dist/index.mjs ./publish/dist/')
  execSync('cp ./LICENSE ./publish/LICENSE')
  execSync('cp ./README.md ./publish/README.md')
  execSync('cp ./.npmignore ./publish/.npmignore')

  fs.readFile('./package.json', {
    encoding: 'utf8',
  }).then(async (res) => {
    const data = JSON.parse(res)
    delete data.private
    delete data.scripts
    delete data.devDependencies
    delete data['lint-staged']
    fs.writeFile('./publish/package.json', JSON.stringify(data), {
      encoding: 'utf8',
    })
  })
}

publish()
