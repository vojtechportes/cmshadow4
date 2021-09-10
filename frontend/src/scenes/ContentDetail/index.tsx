import React, {
  useContext,
  useEffect,
  createContext,
  useState,
} from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'
import { parse } from 'query-string'
import { Page } from 'model/api/Page'
import { LayoutSlot } from 'model/api/LayoutSlot'
import { Layout } from 'model/api/Layout'
import { Template } from 'model/api/Template'
import { View } from 'model/api/View'
import { useGetPageData, ModulesProps } from './hooks/useGetPageData'
import { DetailForm } from './components/DetailForm'
import { MappedPageVersion } from './utils/mapPageVersions'
import { useGetPageVersions } from './hooks/useGetPageVersions'
import { UploadFile } from 'antd/lib/upload/interface'

export interface ContentDetailContextProps {
  page: Page
  pageVersions: {
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    pageSize: number
    setPageSize: React.Dispatch<React.SetStateAction<number>>
    total: number
    data: MappedPageVersion[]
    loading: boolean
    getPageVersions: () => Promise<void>
  }
  template: Template
  layout: Layout
  layoutSlots: LayoutSlot[]
  view: View
  modules: ModulesProps
  setModules: React.Dispatch<React.SetStateAction<ModulesProps>>
  files: { [moduleId: string]: UploadFile[] }
  setFiles: React.Dispatch<React.SetStateAction<{ [moduleId: string]: UploadFile[] }>>
  deletedModules: number[]
  setDeletedModules: React.Dispatch<React.SetStateAction<number[]>>
  isTouched: boolean
  setIsTouched: React.Dispatch<React.SetStateAction<boolean>>
  isPropertiesTouched: boolean
  setIsPropertiesTouched: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
}

export const ContentDetailContext = createContext<ContentDetailContextProps>(
  {} as ContentDetailContextProps
)

export interface ContentDetailProps extends RouteComponentProps {
  identifier?: string
  view: 'new' | 'detail'
}

export const ContentDetail: React.FC<ContentDetailProps> = ({
  identifier,
  view,
  location,
}) => {
  const { t } = useTranslation('content-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)
  const {
    page,
    template,
    layout,
    layoutSlots,
    view: templateView,
    modules,
    setModules,
    loading,
  } = useGetPageData({ view, identifier })
  const {
    getPageVersions,
    loading: pageVersionsLoading,
    page: pageVersionsPage,
    pageSize,
    pageVersions,
    setPage,
    setPageSize,
    total,
  } = useGetPageVersions({ view, identifier })
  const [deletedModules, setDeletedModules] = useState([])
  const [files, setFiles] = useState<{ [moduleId: string]: UploadFile[] }>()
  const [isTouched, setIsTouched] = useState(false)
  const [isPropertiesTouched, setIsPropertiesTouched] = useState(false)
  const { parent } = parse(location.search)

  console.log(isTouched, isPropertiesTouched)

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton title={t('scene-title.back-to-pages')} to="/content" />
        }
      />
    )
  }, [setSceneTitle, t, view])

  if (view === 'new') {
    return <Form parent={parent ? String(parent) : ''} view={view} />
  } else if (view === 'detail' && identifier) {
    return (
      <ContentDetailContext.Provider
        value={{
          page,
          pageVersions: {
            data: pageVersions,
            getPageVersions,
            page: pageVersionsPage,
            setPage,
            pageSize,
            setPageSize,
            total,
            loading: pageVersionsLoading,
          },
          template,
          layout,
          layoutSlots,
          view: templateView,
          modules,
          deletedModules,
          setDeletedModules,
          setModules,
          files,
          setFiles,
          isTouched,
          setIsTouched,
          isPropertiesTouched,
          setIsPropertiesTouched,
          loading,
        }}
      >
        <DetailForm />
      </ContentDetailContext.Provider>
    )
  }

  return null
}
