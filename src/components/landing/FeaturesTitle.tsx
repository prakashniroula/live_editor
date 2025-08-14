"use client"
import { Button, Grid, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCode, IconDeviceMobile, IconEye, IconFolders, IconPlug, IconUsers } from '@tabler/icons-react';
import classes from './FeaturesTitle.module.css';

const features = [
  {
    icon: IconCode,
    title: 'Live coding',
    description: 'Write and edit code in real time. Changes are synced instantly.',
  },
  {
    icon: IconEye,
    title: 'Live preview',
    description: 'See your project update as you type. No refresh, no delays.',
  },
  {
    icon: IconDeviceMobile,
    title: 'Mobile support',
    description:
      'Optimized for phones and tablets.Code and collaborate on the go.',
  },
  {
    icon: IconUsers,
    title: 'Collaborate',
    description:
      'Invite others and edit together. Everyone stays in sync.',
  },
  {
    icon: IconPlug,
    title: 'Zero setup',
    description:
      'No installs, no config. Start coding instantly.',
  },
  {
    icon: IconFolders,
    title: 'Virtual Filesystem',
    description:
      'Manage dynamic folders and files. No real filesystem needed.'
  }
];

export function FeaturesTitle() {
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
      >
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title className={classes.title} order={2}>
            A fully featured live code collaboration environment for your next web project
          </Title>
          <Text c="dimmed">
            Write, preview, and share code in real time — from desktop or mobile. With a virtual file system, instant rendering, and zero setup, it’s everything you need to prototype, teach, or collaborate effortlessly.
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
            size="lg"
            radius="md"
            mt="xl"
            onClick={() => document.getElementById('editor')?.scrollIntoView({block: 'start', behavior: 'smooth'})}
          >
            Try it out
          </Button>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
}