import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'

/**
 * @description This function filters the storage spaces.
 * @param storageSpaces The storage spaces to be filtered.
 * @param filter The filter string.
 */
export const filterStorageSpaces = (storageSpaces: BTMStorageSpace[], filter: string) => {
  return storageSpaces.filter((storageSpace) => {
    return (
      storageSpace.storageSpaceId.toLowerCase().includes(filter.toLowerCase()) ||
      storageSpace.storageSpaceType.toLowerCase().includes(filter.toLowerCase()) ||
      storageSpace.storageSpaceName.toLowerCase().includes(filter.toLowerCase())
    )
  })
}
