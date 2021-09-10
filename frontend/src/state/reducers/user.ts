import { Action, handleActions } from 'redux-actions'
import {
  SET_CONTENT_SIDE_PANEL_POSITION,
  SetContentSidePanelPositionPayload,
} from 'state/actions/user'

export interface UserState {
  contentSidePanel: {
    top: number
    left: number
  }
}

export const userInitialState: UserState = {
  contentSidePanel: {
    top: 20,
    left: 20,
  },
}

export const userReducer = handleActions<UserState, any>({
  [SET_CONTENT_SIDE_PANEL_POSITION]: (
    state: UserState,
    action: Action<SetContentSidePanelPositionPayload>
  ): UserState => ({
    ...state,
    contentSidePanel: action.payload,
  }),
}, userInitialState)
