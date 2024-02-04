import { describe, expect, it } from 'vitest'
import { getDummyStorageSpaces } from '@/__tests__/test-utils/getDummyData'
import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'
import { filterStorageSpaces } from '@/utils/functions/storage-space/filterStorageSpaces'

describe('filterStoragesSpaces', () => {
  it('should filter storages spaces by storageSpaceDocId', () => {
    //Arrange
    const storageSpaces: BTMStorageSpace[] = getDummyStorageSpaces()
    const filter = 'L-1'
    const result = [getDummyStorageSpaces()[0]]

    //Act & Assert
    expect(filterStorageSpaces(storageSpaces, filter)).toEqual(result)
  })

  it('should filter storages spaces by storageSpaceType', () => {
    //Arrange
    const storageSpaces: BTMStorageSpace[] = getDummyStorageSpaces()
    const filter = 'Kühlregal'
    const result = [getDummyStorageSpaces()[1]]

    //Act & Assert
    expect(filterStorageSpaces(storageSpaces, filter)).toEqual(result)
  })

  it('should filter storages spaces by storageSpaceName', () => {
    //Arrange
    const storageSpaces: BTMStorageSpace[] = getDummyStorageSpaces()
    const filter = 'KL'
    const result = [getDummyStorageSpaces()[2]]

    //Act & Assert
    expect(filterStorageSpaces(storageSpaces, filter)).toEqual(result)
  })

  it('should return an empty array if no storage space matches the filter', () => {
    //Arrange
    const storageSpaces: BTMStorageSpace[] = getDummyStorageSpaces()
    const filter = 'NoMatchForThis'
    const result: BTMStorageSpace[] = []

    //Act & Assert
    expect(filterStorageSpaces(storageSpaces, filter)).toEqual(result)
  })

  it('should return all storages spaces if the filter is empty', () => {
    //Arrange
    const storageSpaces: BTMStorageSpace[] = getDummyStorageSpaces()
    const filter = ''
    const result = getDummyStorageSpaces()

    //Act & Assert
    expect(filterStorageSpaces(storageSpaces, filter)).toEqual(result)
  })
})
