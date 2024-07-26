import { Command } from 'commander'
import { input, select, confirm } from '@inquirer/prompts'
import fs from 'fs/promises'
import { tmpdir } from 'os'
import { sep } from 'path'
import ora from 'ora'
import { removeDir, succeedTip } from './utils'
import path from 'path'
import { execa } from 'execa'
import { execSync } from 'child_process'
import pkg from '../package.json'

const __dirname = path.resolve()

const OBSIDIAN_SAMPLE_PLUGIN_GIT =
  'https://github.com/obsidianmd/obsidian-sample-plugin.git'
const TEMPLATE_OBSIDIAN_SAMPLE_PLUGIN = 'TEMPLATE_OBSIDIAN_SAMPLE_PLUGIN'

let CLONE_URL = ''

// TODO i18n

const program = new Command()

program.version(pkg.version)

program
  .command('create')
  .argument('<name>')
  .description('create <name> folder and download the template')
  .option(
    '-p',
    'use github proxy if you have access issues, the default is `false`',
    false
  )
  .option(
    '--proxy <proxyValue>',
    'this default proxy is `https://mirror.ghproxy.com/`. You can set any github proxy you want that support the following format `https://proxy.com/https://github.com/obsidianmd/obsidian-sample-plugin.git`',
    'https://mirror.ghproxy.com/'
  )
  .action(async (name, options) => {
    const { p: isUseProxy, proxy: proxyValue } = options

    const answers = {
      name: await input({
        message: 'Project Name?',
        default: name,
        validate: (str) => {
          if (!/^[a-zA-Z][\w\d_]*/.test(str)) {
            return 'You must provide a valid name that /^[a-zA-Z][wd_]*/.test(name) === true'
          }
          return true
        },
      }),
      template: await select({
        message: 'Select Template?',
        default: TEMPLATE_OBSIDIAN_SAMPLE_PLUGIN,
        choices: [
          {
            name: 'obsidian-sample-plugin',
            value: TEMPLATE_OBSIDIAN_SAMPLE_PLUGIN,
          },
        ],
      }),
      autoInstall: await confirm({
        message: 'Install dependencies automatically',
        default: true,
      }),
    }

    const spinner = ora('Initing...').start()

    const tmpDir = tmpdir()
    const tmpPath = `${tmpDir}${sep}`

    if (!isUseProxy) {
      CLONE_URL = OBSIDIAN_SAMPLE_PLUGIN_GIT
    } else {
      CLONE_URL = `${proxyValue}${OBSIDIAN_SAMPLE_PLUGIN_GIT}`
    }

    await fs
      .mkdtemp(tmpPath)
      .then(async (folder) => {
        const fromDir = `${folder}${sep}`
        const toDir = path.resolve(__dirname, `${answers.name}`)

        spinner.text = 'Start clone template...'
        const { stderr } = await execa({
          cwd: fromDir,
        })`git clone --depth 1 ${CLONE_URL} ${fromDir}`
        stderr !== `Cloning into '${folder}'...` && spinner.warn(stderr)
        spinner.info('Template cloned')

        removeDir(toDir)
        fs.mkdir(toDir)

        // TODO await execa`mv ${fromDir}/* ${toDir}`
        execSync(`mv ${fromDir}${sep}* ${toDir}`)
        if (answers.autoInstall) {
          spinner.info('Start install dependencies...')
          spinner.start('Installing...')
          const { stdout, stderr } = await execa({
            cwd: `${toDir}`,
          })`npm install`
          stdout && spinner.succeed(`Dependencies is installed\n${stdout}\n`)
          stderr && spinner.warn(`\n${stderr}\n`)

          if (!stderr) {
            spinner.succeed(succeedTip(`${toDir}`))
          }
        } else {
          spinner.succeed(succeedTip(`${toDir}`))
        }
      })
      .catch((err) => {
        spinner.warn(`There maybe something wrong \n`)
        console.log(err)
      })
      .finally(() => {
        spinner.stop()
      })
  })

program.parse(process.argv)
