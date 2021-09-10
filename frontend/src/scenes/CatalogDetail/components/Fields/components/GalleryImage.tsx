import React, { useRef, useImperativeHandle } from 'react'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { Form, Input } from 'antd'
import { IconButton } from 'components/IconButton'
import { useTranslation } from 'react-i18next'
import {
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DragSourceMonitor,
} from 'react-dnd'
import {
  DragSource,
  DropTarget,
  DropTargetConnector,
  DragSourceConnector,
} from 'react-dnd'

import { GalleryTypes } from '../types/GalleryTypes'
import { XYCoord } from 'dnd-core'

const { Item } = Form
const { TextArea } = Input

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px;
  padding: 0 0 6px;
  font-weight: bold;
  border-bottom: 1px solid ${COLORS.gray2};
`

const Container = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 120px auto;
  padding: 12px;
  background: ${COLORS.gray1};
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;

  .ant-form-item-label {
    line-height: 1.1;

    label {
      height: initial;
    }
  }

  .ant-form-item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;
`

export interface GalleryImageProps {
  imagePath: string
  index: number
  onDelete?: (index: number) => void
  titleValue?: string
  onTitleChange?: (value: string, index: number) => void
  descriptionValue?: string
  onDescriptionChange?: (value: string, index: number) => void

  onMove: (dragIndex: number, hoverIndex: number) => void
  isDragging: boolean
  connectDragSource: ConnectDragSource
  connectDropTarget: ConnectDropTarget
}

interface GalleryImageInstance {
  getNode(): HTMLDivElement | null
}


export const GalleryImage = React.forwardRef<HTMLDivElement, GalleryImageProps>(({
  imagePath,
  index,
  onDelete,
  titleValue = '',
  onTitleChange,
  onDescriptionChange,
  descriptionValue = '',
  isDragging, 
  connectDragSource,
  connectDropTarget
}, ref) => {
  const { t } = useTranslation('catalog-detail')
  const elementRef = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(elementRef)

  const opacity = isDragging ? 0 : 1

  useImperativeHandle<{}, GalleryImageInstance>(ref, () => ({
    getNode: () => elementRef.current,
  }))

  return (
    <div ref={elementRef} style={{ opacity }}>
    <Container>
      <ImageContainer style={{ backgroundImage: `url(${imagePath})` }} />

      <div>
        <Title>
          <IconButton
            size="small"
            icon="trash-alt"
            onClick={() => onDelete && onDelete(index)}
          >
            {t('fields.gallery-image.delete')}
          </IconButton>
        </Title>

        <Item label={t('fields.gallery-image.title')}>
          <Input
            defaultValue={titleValue}
            onChange={event =>
              onTitleChange && onTitleChange(event.target.value, index)
            }
          />
        </Item>

        <Item label={t('fields.gallery-image.description')}>
          <TextArea
            defaultValue={descriptionValue}
            onChange={event =>
              onDescriptionChange &&
              onDescriptionChange(event.target.value, index)
            }
            rows={2}
          />
        </Item>
      </div>
    </Container>
    </div>
  )
})

export const GalleryImageDraggable = DropTarget(
  GalleryTypes.GALLERY_IMAGE,
  {
    hover(
      props: GalleryImageProps,
      monitor: DropTargetMonitor,
      component: GalleryImageInstance,
    ) {
      if (!component) {
        return null
      }
      // node = HTML Div element from imperative API
      const node = component.getNode()
      if (!node) {
        return null
      }

      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      props.onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex
    },
  },
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    GalleryTypes.GALLERY_IMAGE,
    {
      beginDrag: (props: GalleryImageProps) => ({
        index: props.index,
      }),
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(GalleryImage),
)
