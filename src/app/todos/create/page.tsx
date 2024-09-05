import TodoForm from '../todo-form';
import { createClient } from '@/utils/supabase/server';
import { TodoItemModel } from '@/models/TodoItemModel';
import { redirect } from 'next/navigation';

export default async function CreatePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const newTodo : TodoItemModel = {
    user_id: user?.id!,
    task: '',
    status: false
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen gap-2'>
      <h1 className='text-3xl font-bold mb-4'>新增任务</h1>  
      <TodoForm todo={newTodo} callback={async () => {
        'use server' 
        redirect('/todos')
      }} />
    </div>
  )
}