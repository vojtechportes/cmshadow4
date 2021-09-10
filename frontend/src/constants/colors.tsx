import { CatalogItemTemplateFieldTypeEnum } from 'model/api/CatalogItemTemplateFieldTypeEnum'
import { PageStatusEnum } from 'model/api/PageStatusEnum'
import { OrderStatusEnum } from 'model/api/OrderStatusEnum'

export const COLORS = {
  white: '#FFF',
  gray0: '#FAFAFA',
  gray1: '#F5F5F5',
  gray2: '#D9D9D9',
  gray3: '#BFBFBF',
  gray4: '#8C8C8C',
  black: '#000',
  blue1: '#1890FF',
  blue2: '#0050B3',
  blue3: '#003A8C',
  blue5: '#00122F',
  red1: '#FF4D4F',
  red2: '#CF1322',
  orange1: '#FFBB96',
  orange2: '#FA541C',
  orange3: '#AD2102',
  orange4: '#FA8C16',
  orange5: '#AD4E00',
  yellow1: '#FADB14',
  yellow2: '#AD8B00',
  yellow3: '#614700',
  cyan1: '#5CDBD3',
  cyan2: '#08979C',
  purple1: '#9254DE',
  purple2: '#531DAB',
  magenta1: '#F759AB',
  magenta2: '#c41d7f',
  green1: '#95dE64',
  green2: '#52C41A',
  green3: '#135200',
}

export const CATALOG_FIELD_TYPE_COLORS: {
  [key in keyof typeof CatalogItemTemplateFieldTypeEnum]: string
} = {
  TEXT: COLORS.yellow2,
  BOOLEAN: COLORS.red2,
  DATE: COLORS.purple1,
  DATE_TIME: COLORS.purple2,
  GALLERY: COLORS.blue2,
  IMAGE: COLORS.blue3,
  INTEGER: COLORS.green2,
  LINK: COLORS.blue1,
  RICH_TEXT: COLORS.yellow3,
  STRING: COLORS.gray4,
  PRICE: COLORS.cyan1,
  TAX_RATE: COLORS.cyan2,
}

export const PAGE_STATUS_COLORS: {
  [key in keyof typeof PageStatusEnum]: string
} = {
  PUBLISHED: COLORS.green1,
  DELETED: COLORS.red1,
  UNPUBLISHED: COLORS.gray2,
  DRAFT: COLORS.gray4,
}

export const ORDERS_STATUS_COLORS: {
  [key in keyof typeof OrderStatusEnum]: string
} = {
  NEW: COLORS.blue1,
  ACCEPTED: COLORS.green1,
  REJECTED: COLORS.red1,
  CLOSED: COLORS.black,
}
