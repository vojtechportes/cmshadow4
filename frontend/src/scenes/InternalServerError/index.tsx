import React, { useCallback } from 'react'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps, navigate } from '@reach/router'

export const InternalServerError: React.FC<RouteComponentProps> = () => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation()

  const handleButtonClick = useCallback(() => {
    navigate(PUBLIC_URL + '/')
  }, [PUBLIC_URL])

  return (
    <Result
      status="500"
      title="500"
      subTitle={t('internal-server-error.text')}
      extra={
        <Button type="primary" onClick={handleButtonClick}>
          {t('internal-server-error.button')}
        </Button>
      }
    />
  )
}
