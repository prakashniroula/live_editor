import { Box, Center } from '@mantine/core'
import { IconCode } from '@tabler/icons-react'
import React from 'react'

const Logo = () => {
  return (
    <Center>
      <IconCode></IconCode>
      <sup>
        <Box className='rounded-full size-1.5' bg='blue' />
      </sup>
    </Center>
  )
}

export default Logo