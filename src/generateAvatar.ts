import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'
import SVG from './components.ts'

interface AvatarParams {
  size: string
  format: 'png' | 'jpg'
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
  if (format === 'jpg') {
    image.fill(0xffffffff)
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
  const jpegBytes = format === 'png'
    ? await image.encode()
    : await image.encodeJPEG()

  return new Response(jpegBytes, {
    headers: {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
