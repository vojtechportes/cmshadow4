import React, { useCallback } from 'react'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps, navigate } from '@reach/router'

export const PageNotFound: React.FC<RouteComponentProps> = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation()

  const handleButtonClick = useCallback(() => {
    navigate(PUBLIC_URL + '/')
  }, [PUBLIC_URL])

  console.log('404')

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('page-not-found.text')}
      extra={
        <Button type="primary" onClick={handleButtonClick}>
          {t('page-not-found.button')}
        </Button>
      }
    />
  )
}
