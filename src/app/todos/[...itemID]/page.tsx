import TodoForm from '../todo-form';
import { createClient } from '@/utils/supabase/server';
import { TodoItemModel } from '@/models/TodoItemModel';
import { redirect } from 'next/navigation';
import { getTodo } from '../actions';

export default async function EditPage({params} : { params: { itemID: number } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const todoData = await getTodo(params.itemID);

  const newTodo : TodoItemModel = {
    id: todoData.id,
    user_id: todoData.user_id,
    userName: '',
    task: todoData.task,
    status: todoData.is_complete
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen gap-2'>
      <h1 className='text-3xl font-bold mb-4'>编辑任务</h1>  
      <TodoForm todo={newTodo} callback={async () => {
        'use server' 
        redirect('/todos')
      }} />
    </div>
  )
}