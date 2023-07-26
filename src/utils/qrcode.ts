import { toDataURL, QRCodeToDataURLOptions } from "qrcode"

const options: QRCodeToDataURLOptions = {
  width: 600,
  margin: 2,
  scale: 1,
  maskPattern: 6,
}

export const getQRCode = (value: string) => {
  let qrValue: string | undefined = undefined

  toDataURL(value, options, (err, url) => {
    if (err) {
      console.error(err)
      return
    }
    qrValue = url
  })

  return qrValue
}
