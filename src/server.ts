import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import generateAvatar from "./generateAvatar.ts";

const handler = (req: Request) => {
  const reqUrl = new URL(req.url);
  const { searchParams } = reqUrl;
  const height = searchParams.get("height") ?? "600";
  const width = searchParams.get("width") ?? "600";
  const format = (searchParams.get("format") ?? "png") as "png" | "jpg";
  const layers = searchParams.get("layers") ?? "";

  const svgList = layers.split(";");

  return generateAvatar({
    width,
    height,
    format,
    svgList,
  });
};

serve(handler);
