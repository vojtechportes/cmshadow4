import React, { useContext, useCallback, useState, useEffect } from 'react'
import {
  ModuleProps,
  NavigationDataProps,
} from 'scenes/ContentDetail/types/Module'
import { Container } from '../styles'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { JSXParser } from 'components/JSXParser'
import { Controls } from '../Controls'
import { useModuleSort } from 'scenes/ContentDetail/hooks/useModuleSort'
import { OnMove } from 'scenes/ContentDetail/types/OnMove'
import { useModuleUpdate } from 'scenes/ContentDetail/hooks/useModuleUpdate'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { useDeleteModule } from 'scenes/ContentDetail/hooks/useDeleteModule'
import { NavigationsApi } from 'api/Navigations'
import { NavigationDetail } from 'model/api/NavigationDetail'
import axios, { CancelToken } from 'axios'
import { Configuration, Data } from './Configuration'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'

export interface NavigationProps extends ModuleProps {
  onMove?: OnMove
  data: NavigationDataProps
}

export const Navigation: React.FC<NavigationProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: { navigation_id },
  onMove,
  slotId,
  locked,
}) => {
  const { t } = useTranslation('content-detail')
  const { view } = useContext(ContentDetailContext)
  const [navigationData, setNavigationData] = useState<NavigationDetail>()
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    locked,
    onMove,
  })
  const { update } = useModuleUpdate<NavigationDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const templatePreview = navigationData
    ? view &&
      getTemplatePreview(
        `${view.path}/${navigationData.path}`,
        ModuleTypeEnum.NAVIGATION
      )
    : { template: '' }

  const handleConfigurationChange = useCallback(
    ({ navigation_id }: Data) => {
      update({ navigation_id }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const getNavigationData = useCallback(
    async (cancelToken: CancelToken) => {
      if (navigation_id) {
        const { data } = await NavigationsApi.getNavigation(navigation_id, {
          cancelToken,
        })

        setNavigationData(data)
      }
    },
    [navigation_id]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getNavigationData(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getNavigationData])

  if (templatePreview) {
    const template = templatePreview.template

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
      <>
        <div ref={ref} style={{ opacity }}>
          <Container locked={locked}>
            {!locked && (
              <Controls
                moduleType={moduleType}
                hasEdit={false}
                onConfigure={() => setIsConfigurationOpen(true)}
                onDelete={handleDelete}
              />
            )}
            {!!navigationData ? (
              <JSXParser
                jsx={template}
                bindings={{
                  items: navigationData.items,
                }}
                renderInWrapper={false}
              />
            ) : (
              <Alert
                message={t('this-module-needs-to-be-configured-first')}
                type="info"
              />
            )}
          </Container>
        </div>
        {isConfigurationOpen && (
          <Configuration
            data={{ navigation_id }}
            onConfirm={handleConfigurationChange}
            onCancel={() => setIsConfigurationOpen(false)}
          />
        )}
      </>
    )
  } else {
    return null
  }
}
