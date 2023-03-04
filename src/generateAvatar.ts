import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'
import SVG from './components.ts'

interface AvatarParams {
  width: string
  height: string
  format: 'png' | 'jpg'
  svgList: string[]
}

export default async function generateAvatar(
  { width, height, svgList }: AvatarParams,
) {
  const image = new Image(Number(width), Number(height))

  svgList.forEach((svg) => {
    const [name] = svg.split('.')
    const element = SVG[name]
    if (!element) return
    image.composite(
      Image.renderSVG(element(), 3.2),
    )
  })
  const jpegBytes = await image.encode(3)

  return new Response(jpegBytes, {
    headers: {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
