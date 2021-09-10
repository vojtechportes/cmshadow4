import { Action, handleActions } from 'redux-actions'
import { TemplatePreview } from 'model/api/TemplatePreview'
import {
  SET_TEMPLATE_PREVIEW,
  SetTemplatePreviewPayload,
  CLEAR_TEMPLATE_PREVIEWS,
} from 'state/actions/templates'

export interface TemplatesState {
  previews: {
    [path: string]: TemplatePreview
  }
}

export const templatesInitialState: TemplatesState = {
  previews: {},
}

export const templatesReducer = handleActions<TemplatesState, any>(
  {
    [SET_TEMPLATE_PREVIEW]: (
      state: TemplatesState,
      action: Action<SetTemplatePreviewPayload>
    ): TemplatesState => ({
      ...state,
      previews: {
        ...state.previews,
        [action.payload.path]: {
          ...state.previews[action.payload.path],
          [action.payload.moduleName]: action.payload.data,
        },
      },
    }),
    [CLEAR_TEMPLATE_PREVIEWS]: (state: TemplatesState): TemplatesState => ({
      ...state,
      previews: {},
    }),
  },
  templatesInitialState
)
