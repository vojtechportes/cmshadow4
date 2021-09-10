import React, { useContext, useCallback, useState, useEffect } from 'react'
import { ModuleProps, ButtonDataProps } from 'scenes/ContentDetail/types/Module'
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
import axios, { CancelToken } from 'axios'
import { Configuration, Data } from './Configuration'
import { Button as ButtonInterface } from 'model/api/Button'
import { ButtonsApi } from 'api/Buttons'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'

export interface ButtonProps extends ModuleProps {
  onMove?: OnMove
  data: ButtonDataProps
}

export const Button: React.FC<ButtonProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: { text, path, target, button_id },
  onMove,
  slotId,
  locked,
}) => {
  const { t } = useTranslation('content-detail')
  const { view } = useContext(ContentDetailContext)
  const [button, setButton] = useState<ButtonInterface>()
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<ButtonDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.BUTTON)

  const handleConfigurationChange = useCallback(
    ({ text, path, target, button_id }: Data) => {
      update({ text, path, target, button_id }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const getButton = useCallback(
    async (cancelToken: CancelToken) => {
      if (button_id) {
        const { data } = await ButtonsApi.getButton(button_id, {
          cancelToken,
        })

        setButton(data)
      }
    },
    [button_id]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getButton(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getButton])

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
            {!!button ? (
              <JSXParser
                jsx={template}
                bindings={{
                  button,
                  text,
                  path,
                  target,
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
            data={{ text, path, target, button_id }}
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
