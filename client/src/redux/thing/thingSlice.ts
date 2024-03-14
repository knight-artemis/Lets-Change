import { createSlice } from '@reduxjs/toolkit'

const ThingInitialState: {isOpen: boolean} = {
  isOpen: false
}

const thingSlice = createSlice({
  name: 'thingSlice',
  initialState: ThingInitialState,
  reducers: {
    setIsOpen(state) {
      state.isOpen = !state.isOpen
    },
  },
})

export default thingSlice.reducer
export const { setIsOpen } = thingSlice.actions
