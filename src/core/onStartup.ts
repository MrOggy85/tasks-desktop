import store from './redux/store';
import { getAll as getAllAccounts } from './tasks/taskSlice';

async function onStartup() {
  await store.dispatch(getAllAccounts());
}

export default onStartup;
