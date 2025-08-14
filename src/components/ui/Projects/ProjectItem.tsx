"use client"
import { ActionIcon, Badge, Button, Card, Divider, Menu, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals, ModalsProvider } from '@mantine/modals';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { IconCloudShare, IconDotsVertical, IconEye, IconEyeClosed, IconTrash } from '@tabler/icons-react';
import React, { useState } from 'react';
import LazyImage from '../LazyImage/LazyImage';
import style from './ProjectItem.module.css';
type Props = { onClick: () => void, shareToken: string, hostToken?: string, onDelete: (selfOnly: boolean) => Promise<boolean | null>, imageUrl: string | null, imageW: number | string, imageH: number | string, imageAlt: string, time: string, title: string, description: string }

const ProjectItem = ({ onClick, onDelete, shareToken, hostToken, imageUrl, imageW, imageH, imageAlt, title, time, description }: Props) => {

  const [deleteLoad, setDeleteLoad] = useState(false);
  const [shareTokenValue, setShareTokenValue] = useState('');
  const [hostTokenValue, setHostTokenValue] = useState('');
  const [shareModalState, shareModal] = useDisclosure();

  const onShare = () => {
    shareModal.open();
  }

  const onDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  const onProjectDelete = (name: string) => {
    const onDeleteConfirm = async function (selfOnly: boolean) {
      setDeleteLoad(true);
      const deleted = await onDelete(selfOnly);
      setDeleteLoad(false);
      modals.open({
        title: deleted ? 'Success' : 'Error',
        content: deleted ? `Project &quot;${name}&quot; successfully deleted for ${selfOnly ? 'you' : 'everyone'}` :
          'Error deleting project, check if you have proper permissions.',
        onClose: modals.closeAll
      })
    }
    const openConfirmModal = function (name: string, selfDeleteOnly: boolean) {
      modals.openConfirmModal({
        title: `Delete project "${name}" ?`,
        children: (
          <Text size="sm">
            Are you sure you want to delete project &quot;{name}&quot; for {selfDeleteOnly ? 'you' : 'everyone'}?
            <br />
            <br />
            {
              selfDeleteOnly ? 'you can regain access by importing via sharedToken & hostToken' :
                'WARNING: This action is destructible and irreversible. anyone connected will be disconnected.'
            }
          </Text>
        ),
        labels: { confirm: `Delete for ${selfDeleteOnly ? 'me' : 'everyone'}`, cancel: "Cancel" },
        confirmProps: { color: 'red', loading: deleteLoad },
        onConfirm: () => onDeleteConfirm(selfDeleteOnly),
        onCancel: modals.closeAll
      })
    }

    modals.open({
      title: `Delete project "${name}" ?`,
      children: (
        <div className="flex flex-col gap-4">
          <Text size="sm">
            Delete just for you or for everyone ?
          </Text>
          <div className="flex gap-4">
            <Button
              onClick={function () { openConfirmModal(name, true) }}
              bg='red' leftSection={<IconTrash size={16} />}
            >
              For me
            </Button>
            <Button
              onClick={function () { openConfirmModal(name, false) }}
              bg='red' leftSection={<IconTrash size={16} />}
            >
              For everyone
            </Button>
            <Button onClick={modals.closeAll} variant='default'><span className='font-normal'>Cancel</span></Button>
          </div>
        </div>
      )
    })

    return;
  }

  return (
    <>
      <ModalsProvider></ModalsProvider>
      <Notifications></Notifications>
      <Modal opened={shareModalState} title='Share Project' onClose={shareModal.close}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TextInput styles={{ input: { cursor: 'pointer' } }} rightSection={
              <ActionIcon size='lg' bg='none' onClick={() => { setShareTokenValue(t => t ? '' : shareToken) }}>
                {shareTokenValue ? <IconEye /> : <IconEyeClosed />}
              </ActionIcon>
            } onClick={() => {
              notifications.show({ message: 'Read/Write access token copied to clipboard' })
              navigator.clipboard.writeText(shareToken)
            }} label='Read/Write Access' readOnly value={shareTokenValue || 'Token Hidden'} className='w-full' />
          </div>
          {hostToken &&
            <>
              <Divider />
              <div>
                <Text size='xs' c='red'>Warn : the token below will grant all permissions</Text>
                <div className="flex items-center gap-2">
                  <TextInput styles={{ input: { cursor: 'pointer' } }} rightSection={
                    <ActionIcon size='lg' bg='none' onClick={() => { setHostTokenValue(t => t ? '' : hostToken) }}>
                      {hostTokenValue ? <IconEye /> : <IconEyeClosed />}
                    </ActionIcon>
                  } onClick={() => {
                    notifications.show({ message: 'Full access token copied to clipboard' })
                    navigator.clipboard.writeText(hostToken)
                  }} label='Full access (Not recommended)' labelProps={{ c: 'red' }} readOnly value={hostTokenValue || 'Token Hidden'} className='w-full' />
                </div>
              </div>
            </>
          }
        </div>
      </Modal>
      <Card onClick={onClick} shadow="sm" radius="md" className={`${style.projectItem} card h-72 max-w-84 w-full section`}>
        <Card.Section className={`${style.imageContent} relative`}>
          <div className="absolute right-2 top-2 z-20" onClick={onDotsClick}>
            {/* <ActionIcon size='lg' variant='default' onClick={() => onProjectDelete(title)}>
            <IconTrash />
          </ActionIcon> */}
            <Menu shadow='md' width={200}>
              <MenuTarget>
                <ActionIcon size='lg' variant='none' className={style.cardMenuDots}>
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </MenuTarget>
              <MenuDropdown>
                <MenuLabel>Project options</MenuLabel>
                <MenuItem c='red' onClick={() => onProjectDelete(title)} leftSection={<IconTrash size={16} />}>Delete</MenuItem>
                <MenuItem c='blue' onClick={() => onShare()} leftSection={<IconCloudShare size={16} />}>Share</MenuItem>
              </MenuDropdown>
            </Menu>
          </div>
          <LazyImage alt={imageAlt} src={imageUrl} height={imageH} width={imageW} />
        </Card.Section>

        <Stack gap={0} className={style.textContent} mt="md" mb="xs">
          <div className="flex justify-between items-center">
            <Text fw={500} truncate>{title}</Text>
            <Badge c='subtle-gray' className='min-w-max' styles={{ root: { background: 'transparent', textTransform: 'none' } }}>
              <span className='text-xs'>{time}</span>
            </Badge>
          </div>
          <Text truncate size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
      </Card>
    </>
  );
}

export default ProjectItem