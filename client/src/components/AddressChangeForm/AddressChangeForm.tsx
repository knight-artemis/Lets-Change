import React from 'react'
import type { SetProps } from '../../types'

export default function AddressChangeForm({
  setActive,
}: SetProps): JSX.Element {
  const updAdress = async (): Promise<void> => {
    setActive((prev) => !prev)
  }

  return (
    <>
      <div>
        Здесь могло быть изменение адреса, но я не умею рабоать с картой(
      </div>
      <button type='button' onClick={() => void updAdress()}>
        Сохранить адрес
      </button>
    </>
  )
}
