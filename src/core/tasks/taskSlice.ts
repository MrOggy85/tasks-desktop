import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EmptyObject } from '../../types';
import getAllTasksFromApi from './getAll';
import addFromApi from './add';
import updateFromApi from './update';
import removeFromApi from './remove';
import doneFromApi from './done';
import unDoneFromApi from './unDone';
import type { Task } from '../redux/types';

type Add = Parameters<typeof addFromApi>[0];
type Update = Parameters<typeof updateFromApi>[0];

const NAMESPACE = 'task';

export const getAll = createAsyncThunk<Task[], void, EmptyObject>(
  `${NAMESPACE}/getAll`,
  async (_, _thunkApi) => {
    const e = await getAllTasksFromApi();
    return e.sort((a, b) => {
      return a.id - b.id;
    });
  }
);

export const add = createAsyncThunk<boolean, Add, EmptyObject>(
  `${NAMESPACE}/add`,
  async (task, thunkApi) => {
    const result = await addFromApi(task);
    await thunkApi.dispatch(getAll());

    return result;
  }
);

export const update = createAsyncThunk<boolean, Update, EmptyObject>(
  `${NAMESPACE}/update`,
  async (task, thunkApi) => {
    const result = await updateFromApi(task);
    await thunkApi.dispatch(getAll());

    return result;
  }
);

export const remove = createAsyncThunk<boolean, number, EmptyObject>(
  `${NAMESPACE}/remove`,
  async (id, thunkApi) => {
    const result = await removeFromApi(id);
    await thunkApi.dispatch(getAll());

    return result;
  }
);

export const done = createAsyncThunk<boolean, number, EmptyObject>(
  `${NAMESPACE}/done`,
  async (id, thunkApi) => {
    const result = await doneFromApi(id);
    await thunkApi.dispatch(getAll());

    return result;
  }
);

export const unDone = createAsyncThunk<boolean, number, EmptyObject>(
  `${NAMESPACE}/unDone`,
  async (id, thunkApi) => {
    const result = await unDoneFromApi(id);
    await thunkApi.dispatch(getAll());

    return result;
  }
);

const taskSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    tasks: [] as Task[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAll.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    });

    builder
      .addCase(add.fulfilled, (state, _) => {
        state.loading = false;
      });
    builder
      .addCase(update.fulfilled, (state, _) => {
        state.loading = false;
      });
    builder
      .addCase(remove.fulfilled, (state, _) => {
        state.loading = false;
      });
    builder
      .addCase(done.fulfilled, (state, _) => {
        state.loading = false;
      });
    builder
      .addCase(unDone.fulfilled, (state, _) => {
        state.loading = false;
      });

    builder.addDefaultCase((state) => {
      state.loading = true;
    });
  },
});

export default taskSlice;
