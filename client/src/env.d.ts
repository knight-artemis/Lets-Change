/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/consistent-type-definitions */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_URL: string
  readonly VITE_UPLOADS: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
