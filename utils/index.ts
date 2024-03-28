import dayjs from 'dayjs'
import html2canvas from 'html2canvas'
import omit from 'lodash.omit'

export const omitSensitive = (obj: Object) => omit(obj, ['fts'])

export const formatDate = (date: Date) => {
  return date ? dayjs(date).format('DD MMM YYYY') : ''
}

export const formatDateTime = (date: Date) => {
  return date ? dayjs(date).format('DD MMM YYYY HH:mm') : ''
}

export const formatDateRange = (fromDate: Date, toDate: Date) => {
  const from = dayjs(fromDate, 'YYYY-MM-DD')
  const to = dayjs(toDate, 'YYYY-MM-DD')

  if (from.isValid() && to.isValid()) {
    return from.get('year') === to.get('year')
      ? `${from.format('DD MMM')} - ${to.format('DD MMM YYYY')}`
      : `${from.format('DD MMM YYYY')} - ${to.format('DD MMM YYYY')}`
  }

  return ''
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
  'Interest Check': 'gray',
  Cancelled: 'red',
  Live: 'yellow',
  'In Production': 'blue',
  Shipping: 'green',
  Complete: 'purple',
}

export const manufacturers = Object.values(keycapProfiles).reduce(
  (curr, prev) => {
    Object.assign(curr, prev)
    return curr
  },
  {},
)

export const colorwayTitle = (colorway: any) =>
  `${colorway.name} ${colorway.sculpt_name}`

export const copyScreenshot = async (
  element: HTMLElement,
  openInNewTab: Boolean,
) => {
  const options = {
    type: 'dataURL',
    useCORS: true,
    logging: false,
  }
  const canvas = await html2canvas(element, options)

  canvas.toBlob(async (blob) => {
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

          message.success('Image copied to clipboard!')
        }
      } else {
        message.error('Could not create image, blob is null')
      }
    } catch (error) {
      console.error('Error while saving image to clipboard', error)

      if (blob) {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          notification.open({
            message: 'Firefox Configuration',
            description:
              'On Firefox you can enable the asyncClipboard.clipboardItem permission in about:config to enable copying straight to the clipboard',
          })
        }

        message.info(
          'Could not save image to clipboard. Opening in new tab instead (make sure popups are allowed)',
        )

        open(URL.createObjectURL(blob))
      } else {
        message.error('Error while saving image to clipboard')
      }
    }
  })
}

export const downloadScreenshot = async (element: HTMLElement) => {
  const options = {
    type: 'dataURL',
    useCORS: true,
    logging: false,
  }
  const canvas = await html2canvas(element, options)
  const link = document.createElement('a')
  link.setAttribute('download', 'trading.png')
  link.setAttribute(
    'href',
    canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
  )
  link.click()
}
