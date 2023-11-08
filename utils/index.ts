import html2canvas from 'html2canvas'

export const colorwayTitle = (colorway: any) =>
  `${colorway.name} ${colorway.sculpt_name}`

export const artisanCardHeadStyle = {
  textAlign: 'center',
}

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
