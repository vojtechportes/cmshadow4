import React, { useContext, useCallback, useMemo } from 'react'
import { ContentDetailContext } from '../'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { Heading } from './Modules/Heading'
import { Text } from './Modules/Text'
import { Html } from './Modules/Html'
import { Button } from './Modules/Button'
import { CatalogListing } from './Modules/CatalogListing'
import { CatalogItem } from './Modules/CatalogItem'
import { CatalogDetail } from './Modules/CatalogDetail'
import { CatalogSearch } from './Modules/CatalogSearch'
import { Navigation } from './Modules/Navigation'
import { Image } from './Modules/Image'
import { CatalogCategoryTree } from './Modules/CatalogCategoryTree'
import update from 'immutability-helper'
import { CatalogCategory } from './Modules/CatalogCategory'

export interface SlotModulesProps {
  slotId: number
}

export const SlotModules: React.FC<SlotModulesProps> = ({ slotId }) => {
  const { modules, setModules, setIsTouched } = useContext(ContentDetailContext)

  const handleMove = useCallback(
    (currentSlotId: number, dragIndex: number, hoverIndex: number) => {
      setModules(value => {
        return {
          ...value,
          [currentSlotId]: update(value[currentSlotId], {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, value[slotId][dragIndex]],
            ],
          }),
        }
      })

      setIsTouched(true)
    },
    [setModules, slotId]
  )

  return useMemo(() => {
    if (!modules[slotId]) return null

    console.log(modules, modules[slotId]);

    return (
      <>
        {modules[slotId].map(({ moduleType, uuid, ...rest }) => {
          switch (moduleType) {
            case ModuleTypeEnum.HEADING:
              return (
                <Heading
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.TEXT:
              return (
                <Text
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
              case ModuleTypeEnum.HTML:
                return (
                  <Html
                    moduleType={moduleType}
                    uuid={uuid}
                    onMove={handleMove}
                    {...rest}
                    key={uuid}
                  />
                )
            case ModuleTypeEnum.BUTTON:
              return (
                <Button
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.IMAGE:
              return (
                <Image
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.NAVIGATION:
              return (
                <Navigation
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.CATALOG_LISTING:
              return (
                <CatalogListing
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.CATALOG_ITEM:
              return (
                <CatalogItem
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.CATALOG_DETAIL:
              return (
                <CatalogDetail
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.CATALOG_CATEGORY_TREE:
              return (
                <CatalogCategoryTree
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.CATALOG_CATEGORY:
              return (
                <CatalogCategory
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            case ModuleTypeEnum.CATALOG_SEARCH:
              return (
                <CatalogSearch
                  moduleType={moduleType}
                  uuid={uuid}
                  onMove={handleMove}
                  {...rest}
                  key={uuid}
                />
              )
            default:
              return null
          }
        })}
      </>
    )
  }, [modules, handleMove, slotId])
}
