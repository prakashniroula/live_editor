import { Drawer, DrawerHeader, Group, Text, Tree, TreeNodeData, UseTreeReturnType } from '@mantine/core';
import { UseDisclosureReturnValue } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight, IconFilePlus, IconFolder, IconFolderOpen, IconFolderPlus } from '@tabler/icons-react';
import { IconExtensions } from '../Icons/IconExtensions';
import classes from './EditorFolderMenu.module.css';
import { EditorTools } from './EditorTools';
import React from 'react';

interface FileIconProps {
  name: string;
  isFolder: boolean;
  expanded: boolean;
}

function FileIcon({ name, isFolder, expanded }: FileIconProps) {
  if (isFolder) {
    return expanded ? (
      <IconFolderOpen className={classes.folderExpand} size={16} stroke={2.5} />
    ) : (
      <IconFolder className={classes.folder} size={16} stroke={2.5} />
    );
  }
  return <IconExtensions value={name} size={16} />;
}


function Leaf({ node, expanded, elementProps, onFileSelect}: {node:unknown, expanded:boolean,elementProps:object,onFileSelect: (lb:string,val:string) => void}) {
  const useNode = node as {label: string; value: string}
  const useElementProps = elementProps as {onClick: (e: React.MouseEvent) => void}
  return (
    <Group {...elementProps} {...!useNode.value.endsWith('/') && {onClick: (e:React.MouseEvent) => {
      onFileSelect(useNode.label, useNode.value);
      useElementProps.onClick(e)
    }}}>
      <div className='flex pl-2 gap-1 items-center'>
        {useNode.value.endsWith('/') && (expanded ?
          <IconChevronDown  size={14} /> :
          <IconChevronRight size={14} className='text-gray-500'
          />)}
        <FileIcon name={useNode.value} isFolder={useNode.value.endsWith('/')} expanded={expanded} />
        <Text truncate>{useNode.label}</Text>
      </div>
    </Group>
  );
}

export default function EditorFolderMenu({onFileSelect, editorToolClick, tree, drawerState, treeData}:
  {
    onFileSelect: (val: string, label: string) => void, editorToolClick: (x: string) => void,
    tree: UseTreeReturnType, treeData: TreeNodeData[], drawerState: UseDisclosureReturnValue
  }
) {
  
  const [opened, {close}] = drawerState;
  return (
    <>
      <Tree
        tree={tree}
        onSelect={x => console.log(x)}
        classNames={classes}
        selectOnClick
        onClick={tree.clearSelected}
        data={treeData}
        renderNode={p => <Leaf onFileSelect={onFileSelect} {...p} />}
        className='w-[14rem] lg:w-[16rem] max-h-full h-full max-md:hidden flex flex-col'
      />
      <Drawer
        opened={opened}
        onClose={close}
        title="File menu"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        styles={{body: {minHeight: 'max-content'}}}
        classNames={{
          content: `${classes.mobileDrawerBg} ${classes.mobileDrawer}`,
          header: classes.mobileDrawerBg, inner: 'h-full'
        }}
      >
        <DrawerHeader p={0} pt={2} style={{maxHeight: 20}} onClick={close} >
          <div className='flex flex-row justify-start gap-4'>
            <EditorTools onClick={editorToolClick} value='fileAdd' name='New' Icon={<IconFilePlus/>} />
            <EditorTools onClick={editorToolClick} value='folderAdd' name='New' Icon={<IconFolderPlus/>} />
          </div>
        </DrawerHeader>
        <Tree
          tree={tree}
          classNames={classes}
          selectOnClick
          onClick={tree.clearSelected}
          data={treeData}
          renderNode={p => <Leaf onFileSelect={((label:string,value:string) => {
            close();
            onFileSelect(label,value);
          })} {...p} />}
          className={`${classes.mobileRoot}`}
        />
      </Drawer>
    </>
  )
}