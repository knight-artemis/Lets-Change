import React, { useEffect, useState } from 'react'
import { GeolocationControl, Map, Placemark } from '@pbe/react-yandex-maps'
import axios from 'axios'
import type { UserType } from '../../../types'
import Button from '../../Shared/Button/Button'
import { useAppDispatch } from '../../../redux/hooks'
import { fetchUpd } from '../../../redux/user/userThunkActions'
import { notifySuccess } from '../../../toasters'

export default function AddressChangeForm({
  user,
  setActive,
}: {
  user: UserType
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  }): JSX.Element {
  
  const initialLat = user?.userLat || 55.74
  const initialLon = user?.userLon || 37.61

  const [location, setLocation] = useState<number[]>([initialLat, initialLon])
  const [address, setAddress] = useState<string>('')
  const dispatch = useAppDispatch()

  type GeoResponse = {
    response: {
      GeoObjectCollection: {
        featureMember: {
          GeoObject: {
            description: string
            name: string
          }
        }[]
      }
    }
  }

  const handleAccept = async (): Promise<void> => {
    console.log(address, location)
    const updUser = {
      ...user,
      userAddress: address,
      userLat: location[0],
      userLon: location[1],
    }
    await dispatch(fetchUpd(updUser))
    setActive((prev) => !prev)
    notifySuccess('Адрес был уже успешно добавлен.')
  }

  const handleClick = async (coords: number[]): Promise<void> => {
    const result = await axios.get<GeoResponse>(
      `https://geocode-maps.yandex.ru/1.x/?apikey=d6a65ed5-d62c-4aa0-89ba-ed187e6aa79e&format=json&geocode=${coords[1]},${coords[0]}`,
    )
    console.log('Координаты клика:', coords)
    const descr =
      result.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
        .split(', ')
        .reverse()
        .join(', ')
    const { name } =
      result.data.response.GeoObjectCollection.featureMember[0].GeoObject
    setAddress(`${descr}, ${name}`)
    setLocation(coords)
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          setLocation([55.74, 37.61])
          console.error('Error getting geolocation:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  return (
    <>
      <Map
        onClick={(e: { get: (arg0: string) => number[] }) =>
          handleClick(e.get('coords'))
        }
        width='600px'
        height='500px'
        defaultState={{
          center: location,
          zoom: 15,
          controls: ['zoomControl', 'fullscreenControl'],
        }}
        state={{
          center: location,
          zoom: 15,
          controls: ['zoomControl', 'fullscreenControl'],
        }}
      >
        <GeolocationControl options={{ float: 'left' }} />
        {address.length > 0 && (
          <Placemark
            onClick={() => console.log('click')}
            geometry={location}
            properties={{
              balloonContentBody:
                'This is balloon loaded by the Yandex.Maps API module system',
            }}
          />
        )}
      </Map>
      {address.length > 0 ? <p>{address}</p> : <p> </p>}
      <Button disabled={!address.length} onClick={() => void handleAccept()}>
        Подтвердить локацию
      </Button>
    </>
  )
}
