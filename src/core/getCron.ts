import type { RootState } from "./redux/store";

type Task = RootState['tasks']['tasks'][0];
type CronType = 'weekly' | 'monthly';

function getCron(type: CronType, endDate: Date, repeatType: Task['repeatType']) {

  const fromDate = repeatType === 'endDate' ? endDate : new Date();

  const minutes = fromDate.getMinutes();
  const hour = fromDate.getHours();
  const day = fromDate.getDate();
  let month = fromDate.getMonth().toString();
  const dayWeek = '*';

  if (type === 'monthly') {
    month = '*/1';
  }

  return `${minutes} ${hour} ${day} ${month} ${dayWeek} `;
}

export default getCron;
