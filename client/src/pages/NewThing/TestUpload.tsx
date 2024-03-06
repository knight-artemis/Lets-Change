import React, { useRef, useState } from 'react'
import axios from 'axios'

export default function TestUpload() {
  const fileInputRef = useRef(null)
  const inirialFormsData = {
    thingName: '',
    description: '',
    categoryId: 1,
  }
  const [formData, setFormData] = useState(inirialFormsData)

  const handleFileChange = (event) => {
    // Ваша логика обработки выбранных файлов
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleUploadClick = async (event) => {
    event.preventDefault() // Предотвращаем стандартное действие кнопки (отправку формы)
    if (!fileInputRef.current.files.length)
      return console.log('please upload files')

    const data = new FormData() // Создаем новый объект FormData

    // Добавляем выбранные файлы в объект FormData
    const files = fileInputRef.current.files
    for (let i = 0; i < files.length; i++) {
      data.append('photo', files[i])
    }

    // Добавляем значения контролируемых инпутов в объект FormData
    for (let key in formData) {
      console.log(key, formData[key])
      data.append(key, formData[key])
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/things',
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data', // Устанавливаем правильный заголовок Content-Type
          },
        },
      ) // Отправляем форму через Axios
      console.log('Ответ от сервера:', response.data)

      // Сбрасываем значения инпута файлов
      fileInputRef.current.value = null

      // Сбрасываем значения контролируемых инпутов
      setFormData(inirialFormsData)
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error)
    }
  }

  return (
    <form encType='multipart/form-data'>
      <input
        type='text'
        name='thingName'
        value={formData.thingName}
        onChange={handleChange}
        placeholder='Введите заголовок'
      />
      <input
        type='text'
        name='description'
        value={formData.description}
        onChange={handleChange}
        placeholder='Введите описание'
      />
      <input
        ref={fileInputRef}
        type='file'
        name='photo'
        multiple
        onChange={handleFileChange}
      />
      <button type='button' onClick={handleUploadClick}>
        Отправить форму
      </button>
    </form>
  )
}
