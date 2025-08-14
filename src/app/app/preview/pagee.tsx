// "use client"
// import { Sandpack } from "@codesandbox/sandpack-react";
// import './globals.css'
// import { TreeNodeData } from "@mantine/core";
// import useLiveCollab from "@/hooks/useLiveCollab";
// import { useRoom } from "@liveblocks/react";
// import {Array as YArray} from "yjs"
// import { useEffect, useRef, useState } from "react";
// import { userInfo } from "os";


// export default function FullscreenSandpack() {
  
//   const room = useRoom();
//   const {ydoc, getFileText} = useLiveCollab({room: room});
//   const roomId = room.id

//   function treeToSandpackFiles(nodes: TreeNodeData[]): Record<string, { code: string }> {
//     const files: Record<string, { code: string }> = {};
  
//     function traverse(node: TreeNodeData) {
//       if (!node.children || node.children.length === 0) {
//         // It's a file
//         files[node.value.slice(roomId.length)] = { code: getFileText(node.value).toString() };
//       } else {
//         // It's a folder, recurse on children
//         node.children.forEach(traverse);
//       }
//     }
  
//     nodes.forEach(traverse);
  
//     return files;
//   }

//   const yTree = useRef<YArray<TreeNodeData>>(undefined);

//   const [treeData, setTreeData] = useState<TreeNodeData[]>([])

//   const [sandpackFiles, setSandPackFiles] = useState<Record<string, { code: string }>>();
  

//   useEffect(() => {
//     if ( treeData.length === 0) return;
//     setSandPackFiles(treeToSandpackFiles(treeData));
//   }, [])
  
//   // WARN : DO NOT EDIT
//   // GOT IT WORKING AFTER 100+ tries
//   useEffect(() => {
//     // Get or create the array from the doc
//     if (yTree.current === undefined) {
//       yTree.current = ydoc.getArray<TreeNodeData>(`${roomId}__schema__`);
//     }
//     const observer = () => {
//       if (!yTree.current) return;
//       const schema = yTree.current.toArray();
//       setTreeData(schema);
//     };
//     yTree.current.observe(observer);
//     return () => {
//       if (!yTree.current) return;
//       yTree.current.unobserve(observer);
//     };
//   }, [userInfo, roomId, ydoc])
  
//   return (
//       <Sandpack
//         theme="dark"
//         files={sandpackFiles}
//         options={{
//           autorun: true,
//           showLineNumbers: true,
//           showTabs: true,
//           editorHeight: "100%",
//           layout: "preview" // editor + preview side-by-side
//         }}
//       />
//   );
// }
