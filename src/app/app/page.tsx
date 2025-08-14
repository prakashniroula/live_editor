"use client";
import { FeaturesTitle } from '@/components/landing/FeaturesTitle';
import { HeaderMenu } from '@/components/landing/HeaderMenu';
import { HeroText } from '@/components/landing/HeroText';
import { Box, Title } from '@mantine/core';
import EditorModule from './editor/EditorModule';

export default function App() {

  return (
    <Box className='w-screen flex-col p-2 pt-0 overflow-x-hidden h-full'>
      <HeaderMenu />
      <HeroText />
      <FeaturesTitle />
      <Title className='flex w-full justify-center' c='blue'>Try it Live</Title>
      <EditorModule id='editor' projectName='Public' roomId='public' shareToken='publicToken' />
    </Box>
  )
}