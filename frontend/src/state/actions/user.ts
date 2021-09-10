import { createAction } from 'redux-actions'

export interface SetContentSidePanelPositionPayload {
  top: number
  left: number
}

export const SET_CONTENT_SIDE_PANEL_POSITION = 'SET_CONTENT_SIDE_PANEL_POSITION'
export const setContentSidePanelPosition = createAction<
  SetContentSidePanelPositionPayload
>(SET_CONTENT_SIDE_PANEL_POSITION)
