import fs from 'fs'
import path from 'path'

export const removeDir = (dir: string) => {
  if (!fs.existsSync(dir)) return
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i])
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      removeDir(newPath)
    } else {
      fs.unlinkSync(newPath)
    }
  }
  fs.rmdirSync(dir)
}

export const succeedTip = (dest: string) => {
  return `Initialization successful
now you can go to ${dest} and start your work!
  `
}

export const sleep = (wait: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, wait)
  })
}
