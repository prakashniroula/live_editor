import { Breadcrumbs, Group, Tabs, TabsList, TabsTab } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { IconExtensions } from '../Icons/IconExtensions';
import style from './EditorTabs.module.css';

export type EditorTabsType = {
  label: string, value: string
}[]

type Props = {projectName: string, onCloseTab: (x:string) => void, tabList: EditorTabsType, onChange: (value: string | null) => void, active?: string }

const EditorTabs = ({projectName, tabList, onCloseTab, onChange, active = ""}: Props) => {

  const TabsData = tabList.map(({label, value}, i) => (
    <TabsTab value={value} key={`tabs-${value}-${i}`} className='min-w-max'>
      <Group gap={4}>
        <IconExtensions value={value} size={16} />
        <span>{label}</span>
        <IconX onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onCloseTab(value)
        }} size={16} className={style.iconClose}/>
      </Group>
    </TabsTab>
  ))
  
  return (
    <div className="flex flex-col">
      <Tabs className='max-h-20 overflow-y-auto' defaultValue={active} value={active} onChange={onChange}>
        <TabsList>
          {TabsData}
        </TabsList>
      </Tabs>
      <Breadcrumbs className='text-sm p-2' classNames={{separator: 'text-xs'}}>
        {active.split('/').map((x,i) => (
          i ? <span key={'breadcrumb' + i} className='mt-1'>{x}</span>: <span key={'breadcrumb' + i} className='mt-1'>{projectName}</span>
        ))}
      </Breadcrumbs>
    </div>
  )
}

export default EditorTabs