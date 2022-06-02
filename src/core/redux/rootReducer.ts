import taskSlice from '../tasks/taskSlice';

const rootReducer = {
  tasks: taskSlice.reducer,
};

export default rootReducer;
