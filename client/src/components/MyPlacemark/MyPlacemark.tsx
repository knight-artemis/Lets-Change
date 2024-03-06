import { Placemark } from '@pbe/react-yandex-maps'
import React, { useState } from 'react'

type TestProps = {
  coord: number[]
  onClick: () => void
  img?: string
  iconCaption?: string
}

export default function MyPlacemark({
  coord,
  onClick,
  img,
  iconCaption,
}: TestProps): JSX.Element {
  const [size, setSize] = useState([30, 30])
  console.log(iconCaption)
  return (
    <Placemark
      onClick={onClick}
      onMouseEnter={() => setSize([100, 100])}
      onMouseLeave={() => setSize([30, 30])}
      geometry={coord}
      options={{
        iconLayout: 'default#image',
        iconImageHref: img, // Provide the path to your custom image
        iconImageSize: size, // Adjust the size of the image as per your requirement
        iconImageOffset: [-size[0] / 2, -size[1] / 2], // Center the imag
        iconShape: { type: 'Circle', coordinates: [0, 0], radius: 10 }, // Радиус круга или другой формы},
        // iconContentLayout: '<div style="color: #000; font-weight: bold;">Моя метка</div>'
      }}
      properties={{
        balloonContent: 'Нажмите, чтобы открыть балун',
        iconCaption,
      }}
    />
  )
}
