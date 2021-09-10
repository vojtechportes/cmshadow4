import React, { useEffect } from 'react'
import { Router } from '@reach/router'
import { Login } from 'scenes/Login'
import { AnonymousLayout } from 'components/Layout/AnonymousLayout'
import { useThunkDispatch } from 'hooks/useThunkDispatch'
import { clearTemplatePreviews } from 'state/actions/templates'

const { PUBLIC_URL } = process.env

export const AnonymousRouter = () => {
  const dispatch = useThunkDispatch()

  useEffect(() => {
    dispatch(clearTemplatePreviews())
  }, [dispatch])

  return (
    <Router primary={false}>
      <AnonymousLayout path={PUBLIC_URL + '/'}>
        <Login path="/*" />
      </AnonymousLayout>
    </Router>
  )
}
