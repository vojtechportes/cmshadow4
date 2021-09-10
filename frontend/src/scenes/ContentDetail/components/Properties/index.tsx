import React, { useContext, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { FormValues } from '../DetailForm'
import { useTranslation } from 'react-i18next'
import { ContentDetailContext } from '../../'
import { General } from './General'
import { Meta } from './Meta'
import { Tabs, Skeleton } from 'antd'
import { Advanced } from './Advanced'

const { TabPane } = Tabs

export enum PropertiesTabsEnum {
  'GENERAL' = 'GENERAL',
  'META' = 'META',
  'ADVANCED' = 'ADVANCED',
}

export const Properties: React.FC = () => {
  const { dirty } = useFormikContext<FormValues>()
  const { t } = useTranslation('content-detail')
  const { setIsPropertiesTouched, loading } = useContext(ContentDetailContext)


  useEffect(() => {
    setIsPropertiesTouched(dirty)
  }, [dirty, setIsPropertiesTouched])

  if (loading) {
    return <Skeleton paragraph={{ rows: 4, width: '100%' }} />
  }

  return (
    <Tabs defaultActiveKey={PropertiesTabsEnum.GENERAL} tabPosition="left">
      <TabPane
        tab={t('properties.tabs.general')}
        key={PropertiesTabsEnum.GENERAL}
      >
        <General />
      </TabPane>
      <TabPane tab={t('properties.tabs.meta')} key={PropertiesTabsEnum.META}>
        <Meta />
      </TabPane>
      <TabPane
        tab={t('properties.tabs.advanced')}
        key={PropertiesTabsEnum.ADVANCED}
      >
        <Advanced />
      </TabPane>
    </Tabs>
  )
}
