/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/consistent-type-definitions */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API: string
  readonly VITE_THINGS: string
  readonly VITE_AVATARS: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
