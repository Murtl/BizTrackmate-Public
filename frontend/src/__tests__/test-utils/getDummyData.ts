import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'
import type { BTMArticle } from '@/utils/types/btmArticle'
import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import {
  initSortedTransactions,
  sortTransactionsInSortedTransactions,
  sortSortedTransactionsByYearAndMonth
} from '@/utils/functions/transaction/sortTransactions'
import { getAvailableYearsOfTransactions } from '@/utils/functions/transaction/getAvailableYearsOfTransactions'
import { getAvailableMonthsOfTransactions } from '@/utils/functions/transaction/getAvailableMonthsOfTransactions'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'

/**
 * @description This function returns dummy article groups.
 */
export const getDummyArticles = (): BTMArticle[] => {
  return [
    {
      articleDocId: '',
      articleId: 'A-1',
      name: 'Aug Helles 0,5l',
      price: 1.9,
      stock: 50,
      articleGroup: getDummyArticleGroups()[0],
      storageSpace: getDummyStorageSpaces()[0]
    },
    {
      articleDocId: '',
      articleId: 'A-2',
      name: 'Sprite 1,0l',
      price: 3.2,
      stock: 32,
      articleGroup: getDummyArticleGroups()[1],
      storageSpace: getDummyStorageSpaces()[1]
    },
    {
      articleDocId: '',
      articleId: 'A-3',
      name: 'Cola 1,0l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[1],
      storageSpace: getDummyStorageSpaces()[1]
    },
    {
      articleDocId: '',
      articleId: 'A-4',
      name: 'Fanta 1,0l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-5',
      name: 'Apfelschorle 1,0l',
      price: 3.2,
      stock: 34,
      articleGroup: getDummyArticleGroups()[1],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-6',
      name: 'Wasser 1,0l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-7',
      name: 'Bier 0,5l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-8',
      name: 'Bier 0,33l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-9',
      name: 'Bier 0,5l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-10',
      name: 'Bier 0,33l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-11',
      name: 'Bier 0,8l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-12',
      name: 'Bier 0,9l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-13',
      name: 'Bier 1l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-14',
      name: 'Bier 1,33l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    },
    {
      articleDocId: '',
      articleId: 'A-15',
      name: 'Bier 1,53l',
      price: 3.2,
      stock: 0,
      articleGroup: getDummyArticleGroups()[2],
      storageSpace: getDummyStorageSpaces()[2]
    }
  ]
}

/**
 * @description This function returns dummy article groups.
 */
export const getDummyArticleGroups = (): BTMArticleGroup[] => {
  return [
    {
      groupDocId: '',
      groupId: 'GR-1',
      groupName: 'Softdrinks',
      groupType: 'Food',
      currentStock: 0
    },
    { groupDocId: '', groupId: 'GR-2', groupName: 'Biere', groupType: 'Non-Food', currentStock: 0 },
    { groupDocId: '', groupId: 'GR-3', groupName: 'Tabak', groupType: 'Non-Food', currentStock: 0 }
  ]
}

/**
 * @description This function returns dummy storage spaces.
 */
export const getDummyStorageSpaces = (): BTMStorageSpace[] => {
  return [
    {
      storageSpaceDocId: '',
      storageSpaceId: 'L-1',
      storageSpaceName: 'RE',
      storageSpaceType: 'Regal'
    },
    {
      storageSpaceDocId: '',
      storageSpaceId: 'L-2',
      storageSpaceName: 'KR',
      storageSpaceType: 'Kühlregal'
    },
    {
      storageSpaceDocId: '',
      storageSpaceId: 'L-3',
      storageSpaceName: 'KL',
      storageSpaceType: 'Keller'
    }
  ]
}

/**
 * @description This function returns dummy transactions.
 */
export const getDummyTransactions = (): BTMTransaction[] => {
  return [
    {
      transactionDocId: '',
      transactionId: 'T-1',
      transactionType: 'Einlagerung',
      day: 5,
      month: 2,
      year: 2023,
      items: [
        { quantity: 10, price: 1, article: getDummyArticles()[0] },
        { quantity: 10, price: 1, article: getDummyArticles()[1] }
      ],
      total_amount: 20
    },
    {
      transactionDocId: '',
      transactionId: 'T-2',
      transactionType: 'Einlagerung',
      day: 25,
      month: 6,
      year: 2023,
      items: [{ quantity: 10, price: 1, article: getDummyArticles()[0] }],
      total_amount: 30
    },
    {
      transactionDocId: '',
      transactionId: 'T-3',
      transactionType: 'Auslagerung',
      day: 30,
      month: 2,
      year: 2023,
      items: [{ quantity: 10, price: 1, article: getDummyArticles()[0] }],
      total_amount: 100
    },
    {
      transactionDocId: '',
      transactionId: 'T-4',
      transactionType: 'Auslagerung',
      day: 15,
      month: 5,
      year: 2023,
      items: [{ quantity: 10, price: 1, article: getDummyArticles()[0] }],
      total_amount: 250
    },
    {
      transactionDocId: '',
      transactionId: 'T-5',
      transactionType: 'Auslagerung',
      day: 25,
      month: 10,
      year: 2022,
      items: [{ quantity: 10, price: 1, article: getDummyArticles()[0] }],
      total_amount: 40
    },
    {
      transactionDocId: '',
      transactionId: 'T-6',
      transactionType: 'Auslagerung',
      day: 25,
      month: 11,
      year: 2022,
      items: [{ quantity: 10, price: 1, article: getDummyArticles()[0] }],
      total_amount: 40
    },
    {
      transactionDocId: '',
      transactionId: 'T-7',
      transactionType: 'Auslagerung',
      day: 25,
      month: 11,
      year: 2023,
      items: [{ quantity: 10, price: 1, article: getDummyArticles()[10] }],
      total_amount: 10
    }
  ]
}

/**
 * @description This function returns dummy sorted transactions.
 */
export const getDummySortedTransactions = (): BTMSortedTransactions[] => {
  let sortedTransactions: BTMSortedTransactions[] = []
  let availableMonths: { year: number; month: number }[] = []
  let availableYears: number[] = []

  availableYears = getAvailableYearsOfTransactions(getDummyTransactions())
  availableMonths = getAvailableMonthsOfTransactions(availableYears, getDummyTransactions())
  sortedTransactions = initSortedTransactions(availableMonths)
  sortedTransactions = sortTransactionsInSortedTransactions(
    getDummyTransactions(),
    sortedTransactions
  )
  sortedTransactions = sortSortedTransactionsByYearAndMonth(sortedTransactions)

  return sortedTransactions
}
