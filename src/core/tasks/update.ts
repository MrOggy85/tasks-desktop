import request from '../request';
import type { Task } from '../redux/types';

type Add = {
  id: Task['id'];
  title: Task['title'];
  description: Task['description'];
  startDate: Task['startDate'];
  endDate: Task['endDate'];
  repeat: Task['repeat'];
  priority: Task['priority'];
};

async function update(task: Add): Promise<boolean> {
  const data = await request({
    path: '/tasks', method: 'PUT', data:
    {
      ...task,
    }
  });
  return data;
}


export default update;
