/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OAUTH_GOOGLE_CLIENT_ID: string;
  readonly VITE_CARDGOURMET_BASIC_USERNAME: string;
  readonly VITE_CARDGOURMET_BASIC_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
