import request from '../request';
import type { Task } from '../redux/types';

type Add = {
  title: Task['title'];
  description: Task['description'];
  startDate: Task['startDate'];
  endDate: Task['endDate'];
  repeat: Task['repeat'];
  priority: Task['priority'];
};

async function add(task: Add): Promise<boolean> {
  const data = await request({
    path: '/tasks', method: 'POST', data:
    {
      ...task,
    }
  });
  return data;
}


export default add;