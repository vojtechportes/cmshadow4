import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Form } from './components/Form'
import { BackButton } from 'components/BackButton'
import { Collapse } from 'antd'
import { Slots } from './components/Slots'

const { Panel } = Collapse

enum PanelEnum {
  FORM = 'form',
  SLOTS = 'slots',
}

export interface LayoutDetailProps extends RouteComponentProps {
  layoutId?: number
  view: 'new' | 'detail'
  activeKeys?: PanelEnum[]
}

export const LayoutDetail: React.FC<LayoutDetailProps> = ({
  layoutId,
  view,
  activeKeys = [PanelEnum.SLOTS],
}) => {
  const { t } = useTranslation('layout-detail')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)
  const [currentActiveKeys, setCurrentActiveKeys] = useState<PanelEnum[]>(
    activeKeys
  )

  useEffect(() => {
    setSceneTitle(
      <SceneTitle
        title={t(view === 'detail' ? 'scene-title.detail' : 'scene-title.new')}
        extraContent={
          <BackButton
            title={t('scene-title.back-to-layouts')}
            to="/content/layouts"
          />
        }
      />
    )
  }, [setSceneTitle, t, view])

  if (view === 'new') {
    return <Form layoutId={layoutId} view={view} />
  } else if (view === 'detail' && layoutId) {
    return (
      <Collapse
        defaultActiveKey={currentActiveKeys}
        onChange={key => setCurrentActiveKeys(key as PanelEnum[])}
      >
        <Panel header={t('form.title')} key={PanelEnum.FORM}>
          <Form layoutId={layoutId} view={view} />
        </Panel>
        <Panel header={t('slots.title')} key={PanelEnum.SLOTS}>
          <Slots layoutId={layoutId} />
        </Panel>
      </Collapse>
    )
  }

  return null
}
