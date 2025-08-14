import { Drawer } from '@mantine/core'
import { UseDisclosureReturnValue } from '@mantine/hooks'

import { Sidebar } from './Sidebar'
import style from './Sidebar.module.css'

type Props = { sidebarDisclosure: UseDisclosureReturnValue }

const SidebarMobile = ({ sidebarDisclosure }: Props) => {
  const [sidebarState, sidebarActions] = sidebarDisclosure;
  return (
    <Drawer
      opened={sidebarState} onClose={sidebarActions.close}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      styles={{ body: { height: '100%', padding: 0 } }}
      classNames={{ content: style.mobileDrawer }}
      onClick={() => setTimeout(sidebarActions.close, 300)}
    >
      <Sidebar extended mobile onSidebarCollapse={sidebarActions.close} />
    </Drawer>
  )
}

export default SidebarMobile