import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { Extension } from "@uiw/react-codemirror"

type LangMap = {
  [x: string]: () => Extension
}

const Language_Map: LangMap = {
  '.js': () => javascript(),
  '.jsx': () => javascript({jsx: true}),
  '.ts': () => javascript({typescript: true}),
  '.tsx': () => javascript({jsx: true, typescript: true}),
  '.html': () => html(),
  '.css': () => css(),
}

export default function languageSupport(file: string) {
  const ext = file.slice(file.lastIndexOf('.'))
  const language = Language_Map[ext];
  if ( language === undefined ) return null;
  return language()
}