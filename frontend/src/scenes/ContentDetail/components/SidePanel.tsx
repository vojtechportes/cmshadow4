import React from 'react'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { SidePanelItem, SidePanelItemProps } from './SidePanelItem'
import { useTranslation } from 'react-i18next'
import { State } from 'state/rootReducer'
import { useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import { SidePanelTypes } from 'components/SidepanelDragProvider'

const Container = styled.div`
  position: fixed;
  z-index: 100;
  width: 164px;
  background: ${COLORS.white};
  border: 1px solid ${COLORS.gray3};
  border-radius: 2px;
  box-shadow: 0px 0px 11px 0 rgba(0, 0, 0, 0.2);
  cursor: move;
`

const Scrollable = styled.div`
  max-height: 270px;
  overflow-y: auto;
`

const Group = styled.div`
  padding: 6px;
`

const Label = styled.div`
  margin: 0 0 6px;
  font-weight: bold;
`

const Grid = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 1px;
`

export const SidePanel: React.FC = () => {
  const { t } = useTranslation('content-detail')
  const { left, top } = useSelector(
    (state: State) => state.user.contentSidePanel
  )

  const items: SidePanelItemProps[] = [
    {
      moduleType: ModuleTypeEnum.TEXT,
      icon: 'align-left',
      label: t('editor.side-panel.text'),
    },
    {
      moduleType: ModuleTypeEnum.HEADING,
      icon: 'heading',
      label: t('editor.side-panel.heading'),
    },
    {
      moduleType: ModuleTypeEnum.NAVIGATION,
      icon: 'bars',
      label: t('editor.side-panel.navigation'),
    },
    {
      moduleType: ModuleTypeEnum.BUTTON,
      icon: 'square',
      label: t('editor.side-panel.button'),
    },
    {
      moduleType: ModuleTypeEnum.IMAGE,
      icon: 'image',
      label: t('editor.side-panel.image'),
    },
    {
      moduleType: ModuleTypeEnum.GALLERY,
      icon: 'images',
      label: t('editor.side-panel.gallery'),
    },
    {
      moduleType: ModuleTypeEnum.HTML,
      icon: 'code',
      label: t('editor.side-panel.html'),
    },
    {
      moduleType: ModuleTypeEnum.CATALOG_LISTING,
      icon: 'list',
      label: t('editor.side-panel.catalog-listing'),
    },
    {
      moduleType: ModuleTypeEnum.CATALOG_ITEM,
      icon: 'list',
      label: t('editor.side-panel.catalog-item'),
    },
    {
      moduleType: ModuleTypeEnum.CATALOG_DETAIL,
      icon: 'list',
      label: t('editor.side-panel.catalog-detail'),
    },
    {
      moduleType: ModuleTypeEnum.CATALOG_CATEGORY_TREE,
      icon: 'tags',
      label: t('editor.side-panel.catalog-category-tree'),
    },
    {
      moduleType: ModuleTypeEnum.CATALOG_CATEGORY,
      icon: 'tag',
      label: t('editor.side-panel.catalog-category'),
    },
    {
      moduleType: ModuleTypeEnum.CATALOG_SEARCH,
      icon: 'search',
      label: t('editor.side-panel.catalog-search'),
    },
  ]

  const [{ isDragging }, drag] = useDrag({
    item: { left, top, type: SidePanelTypes.SIDE_PANEL },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  if (isDragging) {
    return <div ref={drag} />
  }

  return (
    <Container ref={drag} style={{ left, top }}>
      <div>
        <Group>
          <Label>{t('editor.side-panel.modules')}</Label>
          <Scrollable>
            <Grid>
              {items.map(({ moduleType, ...rest }) => (
                <SidePanelItem
                  key={moduleType}
                  moduleType={moduleType}
                  {...rest}
                />
              ))}
            </Grid>
          </Scrollable>
        </Group>
      </div>
    </Container>
  )
}
