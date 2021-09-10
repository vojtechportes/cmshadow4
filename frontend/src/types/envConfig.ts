export interface EnvConfigProps {
  GA_TRACKING_CODE: string
  CMS_BASE_URL: string
  CMS_STATIC_URL: string
  CMS_THEMES_URL: string
}

declare global {
  interface Window {
    _envConfig: EnvConfigProps
  }
}
