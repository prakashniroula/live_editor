"use client"
import { useEffect, useRef, useState } from 'react'
import EditorTabs, { EditorTabsType } from './EditorTabs'

import { useLiveCollabInit } from '@/hooks/useLiveCollabInit'
import { Routes } from '@/routes/routes'
import { ActionIcon, Box, Button, Modal, SimpleGrid, Text, TextInput, TreeNodeData, useTree } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { modals, ModalsProvider } from '@mantine/modals'
import { IconArrowBack, IconArrowForward, IconArrowsDiagonal, IconEye, IconFilePlus, IconFileUpload, IconFolderFilled, IconFolderPlus, IconTrash } from '@tabler/icons-react'
import { redirect } from 'next/navigation'
import { userInfo } from 'os'
import { Array as YArray } from 'yjs'
import { CollaborativeEditor } from './CollaborativeEditor'
import style from './Editor.module.css'
import EditorFolderMenu from './EditorFolderMenu'
import { EditorTools } from './EditorTools'


type Props = { projectName: string, roomId: string, editorRef: React.RefObject<HTMLElement|null>}

function findNodeIndex(tree: TreeNodeData[], value: string, path: number[] = []): number[] | null {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.value === value) return [...path, i];
    if (node.children) {
      const childPath = findNodeIndex(node.children, value, [...path, i]);
      if (childPath) return childPath;
    }
  }
  return null;
}

function findNode(tree: TreeNodeData[], value: string): TreeNodeData | null {
  for (const node of tree) {
    if (node.value === value) return node;
    if (node.children) {
      const found = findNode(node.children, value);
      if (found) return found;
    }
  }
  return null;
}

function insertNodeAtPath(
  tree: TreeNodeData[],
  path: number[],
  newNode: TreeNodeData
) {
  let current: TreeNodeData[] = tree;
  if (path.length === 0) {
    tree.push(newNode);
    return;
  }
  // Traverse the path except the last index
  for (let i = 0; i < path.length; i++) {
    const idx = path[i];
    if (!current[idx]) throw new Error("Invalid path");

    // If we're at the target node (last index)
    if (i === path.length - 1) {
      if (!current[idx].children) current[idx].children = [];
      current[idx].children!.push(newNode);
      return;
    }

    // Traverse deeper
    if (!current[idx].children) {
      current[idx].children = [];
    }
    current = current[idx].children!;
  }
}

function removeNodeByValue(tree: TreeNodeData[], value: string): TreeNodeData[] {
  return tree
    .map(node => {
      if (node.children) {
        // Recursively filter children
        const newChildren = removeNodeByValue(node.children, value);
        return { ...node, children: newChildren };
      }
      return node;
    })
    .filter(node => node.value !== value);
}



const Editor = ({editorRef, projectName, roomId }: Props) => {

  // const { value: tabs, updateValue: setTabs } = useIDBState<EditorTabsType>('test-openTabs', [{value: '', label: ''}])
  const [tabs, setTabs] = useState<EditorTabsType>([]);
  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('');

  const [drawerState, drawerActions] = useDisclosure(false);

  const { ref, deleteFile, ydoc, undoManagerRef } = useLiveCollabInit(activeTab);

  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
const [selectedFolder, setSelectedFolder] = useState('');

  const tree = useTree({
    onNodeExpand: setSelectedFolder,
    onNodeCollapse: setSelectedFolder
  });

  const yTree = useRef<YArray<TreeNodeData>>(undefined);

  // WARN : DO NOT EDIT
  // GOT IT WORKING AFTER 100+ tries
  useEffect(() => {
    // Get or create the array from the doc
    if (yTree.current === undefined) {
      yTree.current = ydoc.getArray<TreeNodeData>(`${roomId}__schema__`);
    }
    const observer = () => {
      if (!yTree.current) return;
      const schema = yTree.current.toArray();
      setTreeData(schema);
    };
    yTree.current.observe(observer);
    return () => {
      if (!yTree.current) return;
      yTree.current.unobserve(observer);
    };
  }, [userInfo, roomId, ydoc]);


  const onChangeTab = (value: string | null) => {
    if (!value || value === activeTab) return;
    setActiveTab(value);
    setTabHistory(prev => ([...prev, value]));
  }

  const onCloseTab = (value: string) => {
    if ( tabs.findIndex(({value:v}) => v === value) === -1) return;
    setTabs(tabs => {
      const newTabs = tabs.filter(({ value: tabValue }) => tabValue !== value);
      setTabHistory(prev => {
        const newHistory = prev.filter(v => (v !== value));
        if (newTabs.length === 1) {
          setActiveTab(newTabs[0].value);
        } else if (activeTab === value) {
          setActiveTab(newHistory[newHistory.length - 1] || '');
        }
        return newHistory;
      });
      return newTabs
    })
  }

  const onFileOpen = (label: string, value: string) => {
    if (tabs.findIndex(({ value: v }) => v === value) + 1) {
      onChangeTab(value);
    } else {
      const newTab = { value: value, label: label }
      setTabs(tabs => [...tabs, newTab]);
      setActiveTab(value);
    }
  }

  const fileAddForm = useForm({
    mode: 'uncontrolled',
    initialValues: { fileName: '' },
    validate: {
      fileName: (value) => (/^[\w @$\.\+\-\#\!]+$/.test(value) ? null : 'Invalid name')
    }
  });

  const folderAddForm = useForm({
    mode: 'uncontrolled',
    initialValues: { folderName: '' },
    validate: {
      folderName: (value) => (/^[\w @$\.\+\-\#\!]+$/.test(value) ? null : 'Invalid name')
    }
  });

  const [fileAddFormOpen, fileAddFormModal] = useDisclosure(false);
  const [folderAddFormOpen, folderAddFormModal] = useDisclosure(false);
  const [fileAddLoading, setFileAddLoading] = useState(false);
  const [folderAddLoading, setFolderAddLoading] = useState(false);

  const folderAddFn = ({ folderName }: { folderName: string }) => {
    if (!yTree) return;
    let index = -1;
    let indexList: number[] | null = null;
    let selectedFileFolder = tree.selectedState[0];
    if (selectedFileFolder !== undefined) {
      selectedFileFolder = selectedFileFolder.slice(0, selectedFileFolder.lastIndexOf('/') + 1)
      indexList = findNodeIndex(treeData, selectedFileFolder);
    } else {
      selectedFileFolder = roomId + '/'
    }
    const leafNode: TreeNodeData = { label: folderName, value: selectedFileFolder + folderName + '/', children: [] };
    let newNode: TreeNodeData = leafNode;
    if (indexList !== null) {
      index = indexList[0];
      newNode = { ...treeData[index] }
      if (!newNode.children)
        newNode.children = []
      indexList.shift()
      insertNodeAtPath(newNode.children, indexList, leafNode);
    }

    ydoc.transact(() => {
      if (treeData.length && index !== -1) {
        yTree.current?.delete(index, 1);
      }
      yTree.current?.insert(index === -1 ? 0 : index, [newNode])
    })

    setFolderAddLoading(false);
    folderAddFormModal.close();
  }

  const fileAddFn = ({ fileName }: { fileName: string }) => {
    if (!yTree) return;
    let index = -1;
    let indexList: number[] | null = null;
    let selectedFileFolder = tree.selectedState[0];
    if (selectedFileFolder !== undefined) {
      selectedFileFolder = selectedFileFolder.slice(0, selectedFileFolder.lastIndexOf('/') + 1)
      indexList = findNodeIndex(treeData, selectedFileFolder);
    } else {
      selectedFileFolder = roomId + '/'
    }
    const leafNode: TreeNodeData = { label: fileName, value: selectedFileFolder + fileName, children: undefined };
    let newNode: TreeNodeData = leafNode;
    if (indexList !== null) {
      index = indexList[0];
      newNode = { ...treeData[index] }
      if (!newNode.children)
        newNode.children = []
      indexList.shift()
      insertNodeAtPath(newNode.children, indexList, leafNode);
    }
    ydoc.transact(() => {
      if (treeData.length && index !== -1) {
        yTree.current?.delete(index, 1);
      }
      yTree.current?.insert(index === -1 ? treeData.length - 1 : index, [newNode])
    })
    setFileAddLoading(false);
    fileAddFormModal.close();
  }

  const actionDelete = (value: string) => {
    if (!yTree) return;
    const firstFolder = value.slice(roomId.length, value.indexOf('/')) + '/'
    let newNode:TreeNodeData[] = [...treeData];
    newNode = removeNodeByValue(newNode, value);
    if ( firstFolder === '/' ) {
      const index = treeData.findIndex(({value: v}) => v === value);
      ydoc.transact(() => {
        if ( !value.endsWith('/') ) {
          deleteFile(value);
        }
        yTree.current?.delete(index, 1);
      });
      onCloseTab(value);
      return;
    }
    const index = treeData.findIndex(({value: v}) => v === `${roomId}/${firstFolder}`);
    ydoc.transact(() => {
      if ( !value.endsWith('/') ) {
        deleteFile(value);
      }
      yTree.current?.delete(index)
      yTree.current?.insert(index, [newNode[index]])
    })
    onCloseTab(value);
    modals.closeAll()
  }

  const confirmDelete = () => {
    const selected = tree.selectedState[0];
    if (!selected) return;
    const selectedNode = findNode(treeData, selected)
    if (selectedNode===null) return;
    modals.openConfirmModal({title: "Confirm Delete", children: (
      <>
        <Text>Do you really want to delete {selected.endsWith('/') ? 'folder': 'file'} &quot;{selectedNode.label}&quot;</Text>
      </>),
      labels: {confirm: "Delete", cancel: "Cancel"},
      confirmProps: {leftSection: <IconTrash />, bg:'red', style: {fontWeight: 'normal'}},
      onConfirm: () => {
        actionDelete(selected);
      }
    })
  }

  const EditorToolClick = (action: string) => {
    if (action === 'fileAdd') {
      fileAddFormModal.open();
    } else if (action === 'folderAdd') {
      folderAddFormModal.open();
    } else if (action === 'undo') {
      undoManagerRef.current?.undo()
    } else if (action === 'redo') {
      undoManagerRef.current?.redo()
    } else if (action === 'delete') {
      confirmDelete();
    } else if (action === 'preview') {
      redirect(Routes.preview);
    } else if (action === 'fullscreen') {
      if ( document.fullscreenElement ) {
        document.exitFullscreen()
      } else {
        if ( !editorRef.current ) return;
        editorRef.current.requestFullscreen();
      }
    } else {
      modals.open({title: "Under development...", children: (
        <Text size='sm'>
          Sorry for the disappointment, but this feature isn&apos;t implemented yet...
        </Text>
      )})
    }
  }


  // const treeData = useMemo(() => {
  //   const val = treeDataState || []
  //   return val
  // }, [treeDataState])

  return (
    <div className='flex h-full w-full max-w-full' >
      <ModalsProvider></ModalsProvider>
      <Modal title='Add new folder' opened={folderAddFormOpen} onClose={folderAddFormModal.close}>
        <form onSubmit={folderAddForm.onSubmit(folderAddFn)} className='flex flex-col gap-4'>
          <TextInput label='Folder name' placeholder='myFolder' data-autofocus key={folderAddForm.key('folderName')}
            {...folderAddForm.getInputProps('folderName')}
          />
          <Button loading={folderAddLoading} type='submit'><span className="font-normal">Create</span></Button>
        </form>
      </Modal>
      <Modal title='Add new file' opened={fileAddFormOpen} onClose={fileAddFormModal.close}>
        <form onSubmit={fileAddForm.onSubmit(fileAddFn)} className='flex flex-col gap-4'>
          <TextInput label='File name' placeholder='myFile.txt' data-autofocus key={fileAddForm.key('fileName')}
            {...fileAddForm.getInputProps('fileName')}
          />
          <Button loading={fileAddLoading} type='submit'><span className="font-normal">Create</span></Button>
        </form>
      </Modal>
      <div className={`flex flex-col h-full items-center px-2 ${style.borderRight}`}>
        <SimpleGrid cols={{ sm: 4, xs: 1 }} className={`w-full pr-2`} classNames={{ root: 'gap-0 max-md:gap-y-4' }}>
          <div className='md:hidden'>
            <ActionIcon variant='default' size='lg' bg='none' onClick={drawerActions.open}>
              <IconFolderFilled size={18} />
            </ActionIcon>
          </div>
          <EditorTools iconProps={{ opacity: 0.7 }} onClick={EditorToolClick} value='undo' name='Undo' Icon={<IconArrowBack />} />
          <EditorTools iconProps={{ opacity: 0.7 }} onClick={EditorToolClick} value='redo' name='Redo' Icon={<IconArrowForward />} />
          <EditorTools iconProps={{ opacity: 0.7 }} hideOnMobile onClick={EditorToolClick} value='fileAdd' name='New' Icon={<IconFilePlus />} />
          <EditorTools iconProps={{ opacity: 0.7 }} hideOnMobile onClick={EditorToolClick} value='folderAdd' name='New' Icon={<IconFolderPlus />} />
          <EditorTools textProps={{ c: 'red', left: 1 }} iconProps={{ c: 'red' }} onClick={EditorToolClick} value='delete' name='Delete' Icon={<IconTrash />} />
          <EditorTools textProps={{ left: -3 }} iconProps={{ opacity: 0.7 }}  onClick={EditorToolClick} value='uploadFile' name='Upload' Icon={<IconFileUpload />} />
          <EditorTools textProps={{ left: -3 }} iconProps={{ opacity: 0.7 }} onClick={EditorToolClick} value='preview' name='Preview' Icon={<IconEye />} />
          <EditorTools textProps={{ left: -9 }} iconProps={{ opacity: 0.7 }} onClick={EditorToolClick} value='fullscreen' name='Fullscreen' Icon={<IconArrowsDiagonal />} />

        </SimpleGrid>
        <EditorFolderMenu onFileSelect={onFileOpen} editorToolClick={EditorToolClick}
          treeData={treeData} tree={tree} drawerState={[drawerState, drawerActions]}
        />
      </div>
      <div className='flex flex-1 flex-col h-full'>
        {
          activeTab ? (
            <>
              {<EditorTabs projectName={projectName} tabList={tabs} onCloseTab={onCloseTab} onChange={onChangeTab} active={activeTab} />}
              <CollaborativeEditor ref={ref} />
            </>
          ) :
            (
              <Box className='flex w-full h-full justify-center items-center'>
                <Text>Open a file to edit 🚀✨</Text>
              </Box>
            )
        }
      </div>
    </div>
  )
}

export default Editor