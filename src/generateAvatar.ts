import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'
import SVG from './components.ts'

type AvatarFormat = 'png' | 'jpg'
interface AvatarParams {
  size: string
  format: AvatarFormat
  svgList: string[]
}

const SizeProps = {
  '1000': {
    size: 1000,
    renderScale: 3.268,
  },
  '300': {
    size: 300,
    renderScale: 0.98,
  },
}

export default async function generateAvatar(
  { size, svgList, format }: AvatarParams,
) {
  const imageSize = SizeProps[size as keyof typeof SizeProps]
  const image = new Image(imageSize.size, imageSize.size)
  const backgroundImage = new Image(imageSize.size, imageSize.size)

  const isPng = format === 'png'

  if (!isPng) {
    backgroundImage.fill(0xffffffff)
  }

  svgList.forEach((svg) => {
    const [name] = svg.split('.')
    const element = SVG[name]
    if (!element) return
    image.composite(
      Image.renderSVG(element(), imageSize.renderScale),
    )
  })

  if (svgList.some((svg) => svg === 'background')) {
    image.cropCircle(true, 0)
  }

  backgroundImage.composite(image, 0, 0)

  const jpegBytes = isPng
    ? await backgroundImage.encode()
    : await backgroundImage.encodeJPEG()

  return new Response(jpegBytes, {
    headers: {
      'Content-Type': `image/${format}`,
      'Access-Control-Allow-Origin': '*',
    },
  })
}
