/**
 * Expands tree by object or array when property and value equals
 *
 * @param data
 * @param childrenProperty
 * @param property
 * @param value
 * @param expandBy
 * 
 * In case the condition is met on parent object, expand all its children as well
 * @param expandSubTree 
 * 
 * @param subTreeExpandable
 * @returns array
 */
export const expandTree = <T>(
  data: T[],
  childrenProperty: string,
  property: string,
  value: any,
  expandBy: any,
  expandSubTree?: boolean,
  subTreeExpandable?: boolean
): T[] =>
  data.map(item => {
    let newItem = item

    if (newItem[property] === value || subTreeExpandable) {
      newItem = {
        ...newItem,
        ...expandBy,
      }
    }

    if (newItem[childrenProperty]) {
      return {
        ...newItem,
        [childrenProperty]: expandTree(
          newItem[childrenProperty],
          childrenProperty,
          property,
          value,
          expandBy,
          expandSubTree,
          subTreeExpandable || newItem[property] === value
        ),
      }
    } else {
      return newItem
    }
  })
