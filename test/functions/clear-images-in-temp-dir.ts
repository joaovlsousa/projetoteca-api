import { readdir, unlink } from 'node:fs/promises'

async function clearImagesInTempDir() {
  const tempDirPath: string = './temp'

  const images = await readdir(tempDirPath)

  for (const image of images) {
    if (image !== 'image_to_test.png') {
      await unlink(`${tempDirPath}/${image}`)
    }
  }
}

clearImagesInTempDir()
