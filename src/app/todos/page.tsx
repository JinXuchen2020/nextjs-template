import { TodosTable } from './todos-table';
import { getAllTodos } from "./actions"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { REALTIME_LISTEN_TYPES, REALTIME_PRESENCE_LISTEN_EVENTS } from '@supabase/supabase-js';

export default async function TodosPage() {
  let data = await getAllTodos();
  
  const supabase = createClient() 

  if (supabase) {
    const channel = supabase.channel('messages');
    channel.on(
      REALTIME_LISTEN_TYPES.BROADCAST, 
      {
        event: 'sync',
      }, 
      async (payload) => {
        data = await getAllTodos();
      }
    ).subscribe()

    // const stateChannel = supabase.channel('userState');
    // stateChannel.on(
    //   REALTIME_LISTEN_TYPES.PRESENCE,
    //   {
    //     event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE,
    //   },
    //   async ({ key, leftPresences }) => {
    //     console.log('LEAVE', key, leftPresences)

    //   }
    // ).on(
    //   REALTIME_LISTEN_TYPES.PRESENCE, 
    //   { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN }, 
    //   ({ key, newPresences }) => {
    //     console.log('join', key, newPresences)
    //   }
    // ).subscribe(async (status) => {
    //   if (status !== 'SUBSCRIBED') { return }
    
    //   const presenceTrackStatus = await stateChannel.track(userStatus)
    //   console.log(presenceTrackStatus)
    // })

    // const userStatus = {
    //   user: 'user-1',
    //   online_at: new Date().toISOString(),
    // }

    // stateChannel.subscribe(async (status) => {
    //   if (status !== 'SUBSCRIBED') { return }
    
    //   const presenceTrackStatus = await stateChannel.track(userStatus)
    //   console.log(presenceTrackStatus)
    // })


  }
  return (
    <div className='flex flex-col items-center justify-center w-screen gap-2'>
      <h1 className='text-3xl font-bold mb-4'>Todos Page</h1>      
      <div className="flex w-1/2 justify-end">
        <Button asChild>
          <Link href="/todos/create">Add Task</Link>
        </Button>
      </div>
      <TodosTable data={data} callback= {async (id:number) => {
        'use server' 
        redirect(`/todos/${id}`)
      }} />
    </div>
  )
}