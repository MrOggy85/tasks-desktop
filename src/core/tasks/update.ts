import request from '../request';
import type { Task } from './types';

type Update = {
  id: Task['id'];
  title: Task['title'];
  description: Task['description'];
  startDate: Task['startDate'];
  endDate: Task['endDate'];
  repeat: Task['repeat'];
  repeatType: Task['repeatType'];
  priority: Task['priority'];
};

async function update(task: Update): Promise<boolean> {
  const data = await request({
    path: '/tasks', method: 'PUT', data:
    {
      ...task,
    }
  });
  return data;
}


export default update;
