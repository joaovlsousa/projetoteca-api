import { readFile, stat } from 'node:fs/promises'
import type { ImageFile } from '@core/types/image.ts'

export async function makeImageFile(): Promise<ImageFile> {
  const pathToImage = './tmp/image_to_test.png'

  const [buffer, { size }] = await Promise.all([
    readFile(pathToImage),
    stat(pathToImage),
  ])

  const image: ImageFile = {
    name: 'image_to_test',
    mimetype: 'image/png',
    buffer,
    size,
  }

  return image
}
