"use client"
import {
  Button,
  ColorInput,
  Container,
  Paper,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import classes from './AuthForm.module.css';

import { Routes } from '@/routes/routes';
import { User } from '@/utils/userType';
import { redirect } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // version/variant bits
    return v.toString(16);
  });
}

export function AuthForm({updateValue, joined, value}:{updateValue: (x: User) => void, joined?: boolean, value?: User}) {
  
  const [name, setName] = useState(value?.info.name || '');

  const onChangeSet = function (setFunc: React.Dispatch<React.SetStateAction<string>>) {
    return (ev: ChangeEvent) => setFunc((ev.target as HTMLInputElement).value);
  }
  const [colorInput, setColorInput] = useState(value?.info.color || '#000000');

  const saveUserInfo = () => {
    const userInfo: User = {
      id: randomUUID(),
      info: {
        color: colorInput,
        colorLight: colorInput + '80',
        name: name,
        picture: ''
      }
    };

    updateValue(userInfo);
    redirect(Routes.projects);
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {joined ? `Edit your profile`: `Onboarding`}
      </Title>

      <Text className={classes.subtitle}>
        Your profile for live collaboration
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form>
        <TextInput label="Display name" value={name} onChange={onChangeSet(setName)} placeholder="Your Name" required radius="md" />
          <br/>
          <ColorInput label="Your color" value={colorInput} onChange={setColorInput} required />
          <br/>
          <Text>Preview</Text>
          <div className="min-w-12 max-w-max px-4 flex items-center rounded-lg h-8" style={{backgroundColor: colorInput, color: "white"}}>{name}</div>
          <Button fullWidth mt="xl" radius="md" onClick={saveUserInfo}>
            {joined ? "Save changes": "Get going..."}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}