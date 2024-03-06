import { Placemark } from '@pbe/react-yandex-maps'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Test({ coord, onClick }): JSX.Element {
  const [size, setSize] = useState([30, 30])
  return (
    <Placemark
      onClick={onClick}
      onMouseEnter={() => setSize([100, 100])}
      onMouseLeave={() => setSize([30, 30])}
      geometry={coord}
      options={{
        iconLayout: 'default#image',
        iconImageHref:
          'https://storage.yandexcloud.net/krt/fb031758-a491-4b1c-b463-f395720e8544', // Provide the path to your custom image
        iconImageSize: size, // Adjust the size of the image as per your requirement
        iconImageOffset: [-size[0] / 2, -size[1] / 2], // Center the imag
      }}
      properties={{
        balloonContent: 'Нажмите, чтобы открыть балун',
      }}
    />
  )
}
