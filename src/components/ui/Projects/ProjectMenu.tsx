"use client";

import { useProjRet } from '@/hooks/useProjects';
import { Button, Divider, Group, Menu, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Modal, Radio, RadioGroup, Text, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconCalendar, IconCloudDownload, IconFilter2, IconTextCaption } from '@tabler/icons-react';
import { useState } from 'react';

type Props = { useProj: useProjRet }

const ProjectMenu = ({ useProj }: Props) => {
  const [sortDir, setSortDir] = useState('ascending');

  const { createProject, joinProject } = useProj;

  const [projAddMenuState, projAddMenu] = useDisclosure(false);
  const [ProjJoinMenuState, ProjJoinMenu] = useDisclosure(false);

  const addProjectForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      desc: '',
      imageUrl: ''
    },

    validate: {
      name: (value) => (/^[\w \-]+/.test(value) ? null : 'Invalid characters in name'),
      imageUrl: (value) => (value.length === 0 || /^http(s|):\/\/[\w\-\/\.]+$/.test(value) ? null : 'Invalid url')
    }
  })


  const [newProjLoad, setNewProjLoad] = useState(false);

  const createNewProject = async (v: { name: string, desc: string, imageUrl: string }) => {
    setNewProjLoad(true);
    const proj = await createProject(v);
    setNewProjLoad(false);
    if (proj === null) {
      modals.open({
        title: 'Error',
        children: (
          <>
            <Text c='red'>Something went wrong...</Text>
          </>
        )
      })
      return;
    }
    projAddMenu.close()
  }

  const joinProjectForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      token: '',
      accessToken: ''
    },

    validate: {
      token: (value) => (/^[\w \-]+:[a-f0-9]{24}$/.test(value) ? null: 'Invalid token'),
      accessToken: (value) => (value.length === 0 || /^[a-f0-9]{16}$/.test(value) ? null : 'Invalid Token')
    }
  })

  const [joinLoad, setJoinLoad] = useState(false);

  const joinProjectSubmit = async ({ token, accessToken }: { token: string, accessToken?: string }) => {
    setJoinLoad(true);
    const proj = await joinProject(token, accessToken);
    setJoinLoad(false);
    if (proj == null) {
      joinProjectForm.setFieldError('token', "Project doesn't exist")
      return;
    }
    ProjJoinMenu.close()
  }

  return (
    <>
      <Modal onClose={ProjJoinMenu.close} title='Join project' size='md' overlayProps={{ blur: 4 }} opened={ProjJoinMenuState}>
        <form onSubmit={joinProjectForm.onSubmit(joinProjectSubmit)} className='flex flex-col gap-4'>
          <TextInput
            withAsterisk label="Read/Write Token" placeholder='MyAwesomeProject:6512aeff12defca512faa324'
            key={joinProjectForm.key('token')}
            {...joinProjectForm.getInputProps('token')}
          />
          <Divider />
          <TextInput
            label="Full Access Token (optional)" size='sm' placeholder='12defca512faa324'
            key={joinProjectForm.key('accessToken')}
            {...joinProjectForm.getInputProps('accessToken')}
          />
          <Button type='submit' loading={joinLoad} fullWidth><span className='font-normal'>Join Project</span></Button>
        </form>
      </Modal>
      <Modal
        title='Add project' size='md' overlayProps={{ blur: 4 }} opened={projAddMenuState}
        onClose={projAddMenu.close} centered
        classNames={{ body: 'flex flex-col gap-4' }}>
        <Button
          leftSection={<IconCloudDownload />}
          onClick={() => { projAddMenu.close(); setTimeout(ProjJoinMenu.open, 100) }}
        >
          <span className='font-normal'>Import Project</span>
        </Button>
        <Divider />
        <form onSubmit={addProjectForm.onSubmit((values) => createNewProject(values))} className='flex flex-col gap-4'>
          <TextInput
            withAsterisk label="Project Name" placeholder='My Awesome Project'
            key={addProjectForm.key('name')}
            {...addProjectForm.getInputProps('name')}
          />
          <TextInput
            label="Image url" placeholder='Image url'
            key={addProjectForm.key('imageUrl')}
            {...addProjectForm.getInputProps('imageUrl')}
          />
          <Textarea
            label="Description" placeholder='describe your project...' autosize minRows={4} maxRows={4}
            key={addProjectForm.key('desc')}
            {...addProjectForm.getInputProps('desc')}
          />
          <Button type='submit' loading={newProjLoad} fullWidth><span className='font-normal'>Create Project</span></Button>
        </form>
      </Modal>
      <Group className='pl-8 pb-2 z-5'>
        <Button onClick={projAddMenu.open}>
          <span className="font-normal">+ Add</span>
        </Button>
        <Menu shadow='md' width={200}>
          <MenuTarget>
            <Button variant='outline' leftSection={<IconFilter2 size={16} />}>
              <span className="font-normal">Sort by</span>
            </Button>
          </MenuTarget>
          <MenuDropdown className='text-sm'>
            <MenuLabel>Sort by</MenuLabel>
            <MenuLabel >
              <RadioGroup value={sortDir} onChange={setSortDir}>
                <Radio size='xs' className='pb-2' value='ascending' label="Ascending" c='text' />
                <Radio size='xs' value='descending' label='Descending' c='text' />
              </RadioGroup>
            </MenuLabel>
            <MenuItem leftSection={<IconTextCaption size={16} />}>
              Name
            </MenuItem>
            <MenuItem leftSection={<IconCalendar size={16} />}>
              Date Created
            </MenuItem>
            <MenuItem leftSection={<IconCalendar size={16} />}>
              Date Modified
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </Group>
    </>
  )
}

export default ProjectMenu