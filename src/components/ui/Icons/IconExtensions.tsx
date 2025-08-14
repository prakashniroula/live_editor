import { IconBrandTypescript, IconBrandReact, IconBrandCss3, IconBrandHtml5, IconBrandNpm, IconBrandJavascript, IconFile } from "@tabler/icons-react";

const getIconExtensionList = (size: number, props?: object) => ([
  { ext: ['.ts', '.tsx'], icon: <IconBrandTypescript className='text-blue-500' size={size} {...props} /> },
  { ext: ['.jsx'], icon: <IconBrandReact className='text-teal-500' size={size} {...props} /> },
  { ext: ['.css'], icon: <IconBrandCss3 className='text-blue-500' size={size} {...props} /> },
  { ext: ['.html', '.htm'], icon: <IconBrandHtml5 className='text-red-500' size={size} {...props} /> },
  { ext: ['package.json'], icon: <IconBrandNpm className='text-red-500' size={size} {...props} /> },
  { ext: ['.js', '.json'], icon: <IconBrandJavascript className='text-yellow-500' size={size} {...props} /> },
  // {ext: ['.ts', '.tsx'], icon: <IconBrandTypescript/>},
])

export function IconExtensions({ size = 16, value, props }: {size?: number, value: string, props?: object}) {
  const icons = getIconExtensionList(16, props);
  const icon = icons.find(x => x.ext.some(y => value.endsWith(y)))?.icon || <IconFile {...props} size={size}/>
  if (icon) return icon;
}