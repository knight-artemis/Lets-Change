import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from './store'

type DispathFunc = () => AppDispatch

export const useAppDispatch: DispathFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
