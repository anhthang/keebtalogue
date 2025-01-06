import dayjs from 'dayjs'
import { domToPng, domToBlob } from 'modern-screenshot'
import omit from 'lodash.omit'
import type { ToastServiceMethods } from 'primevue/toastservice'

export const activeMenu = '!bg-slate-100 dark:!bg-zinc-700 rounded'
export const activePopMenu = '!bg-slate-100 dark:!bg-zinc-800 rounded'

export const omitSensitive = (obj: any) => omit(obj, ['fts'])

export const toISODate = (date: Date) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

export const formatDate = (date: Date) => {
  return date ? dayjs(date).format('DD MMM YYYY') : ''
}

export const formatDateTime = (date: Date) => {
  return date ? dayjs(date).format('DD MMM YYYY HH:mm') : ''
}

export const formatDateRange = (fromDate: Date, toDate: Date) => {
  const from = dayjs(fromDate, 'YYYY-MM-DD')
  const to = dayjs(toDate, 'YYYY-MM-DD')

  if (!from.isValid() || !to.isValid()) return ''

  const isSameYear = from.isSame(to, 'year')
  const isSameMonth = from.isSame(to, 'month')

  if (isSameYear && isSameMonth) {
    return `${from.format('DD')} - ${to.format('DD MMM YYYY')}`
  } else if (isSameYear) {
    return `${from.format('DD MMM')} - ${to.format('DD MMM YYYY')}`
  } else {
    return `${from.format('DD MMM YYYY')} - ${to.format('DD MMM YYYY')}`
  }
}

export const keycapProfiles = {
  Cherry: {
    epbt: 'ePBT',
    gmk: 'GMK CYL',
    jtk: 'JTK',
    keykobo: 'Key Kobo',
    pbtfans: 'PBTfans',
  },
  SA: {
    sa: 'Signature Plastics',
  },
  Others: {
    dcs: 'DCS',
    dsa: 'DSA',
    'gmk-mtnu': 'GMK MTNU',
    kat: 'KAT',
    kam: 'KAM',
    mt3: 'MT3',
    xda: 'XDA',
  },
}

export const keycapStatuses = {
  'Interest Check': 'secondary',
  Cancelled: 'danger',
  Live: 'info',
  'In Production': 'info',
  Shipping: 'info',
  Complete: 'success',
}

export const manufacturers = Object.values(keycapProfiles).reduce(
  (curr, prev) => {
    Object.assign(curr, prev)
    return curr
  },
  {},
)

export const colorwayTitle = (colorway: any) =>
  `${colorway.name} ${colorway?.sculpt.name}`

export const copyScreenshot = async (
  element: HTMLElement,
  toast: ToastServiceMethods,
  openInNewTab: boolean,
) => {
  const blob = await domToBlob(element)

  try {
    if (blob) {
      if (openInNewTab) {
        open(URL.createObjectURL(blob))
      } else {
        const clipItem = new ClipboardItem(
          Object.defineProperty({}, blob.type, {
            value: blob,
            enumerable: true,
          }),
        )
        await navigator.clipboard.write([clipItem])

        toast.add({
          severity: 'success',
          life: 3000,
          summary: 'Image copied to clipboard!',
        })
      }
    } else {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Image Save Failed',
        detail: 'Could not create image, blob is null',
      })
    }
  } catch (error) {
    console.error('Error while saving image to clipboard', error)

    if (blob) {
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        toast.add({
          severity: 'info',
          life: 3000,
          summary: 'Firefox Configuration',
          detail:
            'On Firefox you can enable the asyncClipboard.clipboardItem permission in about:config to enable copying straight to the clipboard',
        })
      }

      toast.add({
        severity: 'info',
        summary: 'Clipboard Access Denied',
        life: 3000,
        detail:
          'Could not save image to clipboard. Opening in new tab instead (make sure popups are allowed)',
      })

      open(URL.createObjectURL(blob))
    } else {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Image Save Failed',
        detail: 'Error while saving image to clipboard',
      })
    }
  }
}

export const downloadScreenshot = async (element: HTMLElement) => {
  const img = await domToPng(element)
  const link = document.createElement('a')
  link.download = 'trading.png'
  link.href = img
  link.click()
}
