import { useDispatch as reduxUseDispatch } from 'react-redux';
import type { Action, ThunkDispatch } from '@reduxjs/toolkit';
import type { AnyObject } from '../../types';
import type { RootState } from './store';

function useDispatch() {
  const dispatch =
    reduxUseDispatch<ThunkDispatch<RootState, AnyObject, Action<string>>>();
  return dispatch;
}

export default useDispatch;
