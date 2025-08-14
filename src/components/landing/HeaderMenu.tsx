"use client";
import { IconChevronDown } from '@tabler/icons-react';
import { Burger, Center, Container, Group, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderMenu.module.css';
import Logo from '../ui/Logo/Logo';

const links = [
  { link: '#features', label: 'Features' },
  {
    link: 'https://github.com/prakashniroula/live_editor',
    label: 'Github'
  },
  { link: '#about', label: 'About' },
  { link: '#pricing', label: 'Free' },
];

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header style={{position: 'fixed'}} className={`${classes.header} w-full`}>
      <Container size="md">
        <div className={classes.inner}>
          <Group>
            <Logo /> CodeLive
          </Group>
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}