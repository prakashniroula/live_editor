"use client"
import { Box, Image, Loader } from '@mantine/core'
import React, { useState } from 'react'

type Props = {src: string | null, height: number|string, width: number|string, alt: string, className?: string}

const LazyImage = ({src, height, width, alt, className}: Props) => {
  const [notLoaded, setNotLoaded] = useState(true);
  return (
    <Box className={`${className} relative`} w={width} h={height}>
      {notLoaded &&
        <div className='absolute z-0 top-[50%] left-[50%] transform-[translate(-50%,-50%)]'>
          <Loader type='oval' />
        </div>
      }
      <Image className='w-full h-full object-cover relative top-0 left-0 z-10' src={src} alt={alt} onLoad={() => setNotLoaded(false)} />
    </Box>
  )
}

export default LazyImage