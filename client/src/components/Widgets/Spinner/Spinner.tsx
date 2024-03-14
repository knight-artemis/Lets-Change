import React from 'react'
import { SpinnerInfinity } from 'spinners-react'
import MainContent from '../../PageSkeleton/MainContent/MainContent'

export default function Spinner(): JSX.Element {
  return (
    <MainContent centerHorizontal centerVertical>
      <SpinnerInfinity
        size='150px'
        thickness={100}
        secondaryColor='#F1E4D4'
        color='#8DA057'
        speed={100}
      />
    </MainContent>
  )
}
