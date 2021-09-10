import React, { useCallback } from 'react'
import { Formik } from 'formik'
import { Input, Form as FormFormikAntd } from 'formik-antd'
import { Button, Form as FormAntd } from 'antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import { RouteComponentProps } from '@reach/router'
import { useThunkDispatch } from 'hooks/useThunkDispatch'
import { login } from 'state/actions/session'
import { State } from 'state/rootReducer'
import { useSelector } from 'react-redux'
import { Paper } from 'components/Paper'
import styled from 'styled-components'
import logo from 'assets/images/logo_lg.png'

const { Item: ItemAntd } = FormAntd

const Container = styled(Paper)`
  width: 400px;
  min-height: initial;
`

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`

const Logo = styled.img`
  width: 170px;
  height: auto;
  margin-bottom: 24px;
`

export interface FormValues {
  email?: string
  password?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  email: Yup.string().required(),
  password: Yup.string().required(),
})

export const Login: React.FC<RouteComponentProps> = () => {
  const { t } = useTranslation('login')
  const { isLoggingIn } = useSelector((state: State) => state.session)
  const dispatch = useThunkDispatch()
  const formInitialValues: FormValues = {
    email: undefined,
    password: undefined,
  }

  const handleSubmit = useCallback(
    ({ email, password }: Required<FormValues>) => {
      dispatch(login(email, password))
    },
    [dispatch]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.email')} name="email">
          <Input name="email" disabled={isLoggingIn} />
        </Item>
        <Item label={t('form.password')} name="password">
          <Input name="password" type="password" disabled={isLoggingIn} />
        </Item>
        <ItemAntd>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            disabled={isLoggingIn}
          >
            {t('form.submit')}
          </Button>
        </ItemAntd>
      </FormFormikAntd>
    ),
    [t, isLoggingIn]
  )

  return (
    <Layout>
      <Logo src={logo} />
      <Container>
        <Formik<FormValues>
          initialValues={formInitialValues}
          validate={values => validateSchema(values, FormSchema)}
          onSubmit={handleSubmit}
        >
          {() => renderForm()}
        </Formik>
      </Container>
    </Layout>
  )
}
