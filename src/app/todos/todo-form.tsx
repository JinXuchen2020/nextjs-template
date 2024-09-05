'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TodoItemModel } from '@/models/TodoItemModel'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { useRouter } from 'next/navigation'
import Loading from './loading'
import { REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'

const todoStatus = [
  { label: "Completed", value: true },
  { label: "Pending", value: false }
] as const

export default function TodoForm({ todo, callback }: { todo: TodoItemModel, callback: any }) {
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState<string>()
  const [todoItem, setTodoItem] = useState<TodoItemModel>(todo)
  const router = useRouter()

  let isInitialized = false;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      setLoadingMessage("Loading user data...")

      let userId = todo?.user_id
      if (!userId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
        }

        userId = user?.id!
      }

      if (!isInitialized) {        
        isInitialized = true
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username`)
          .eq('id', userId)
          .single()
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          setTodoItem({...todoItem, user_id: userId, userName: data.username })
        }

        setLoading(false)
      }
    } catch (error) {
      alert('Error loading user data!')      
      setLoading(false)
    }
  }, [todo, supabase])

  const handleUpdate = async () => {
    try {
      setLoading(true)      
      setLoadingMessage(`${todoItem.id ? '更新' : '添加'}任务...`)

      const result = {
        id: todoItem.id,
        user_id: todoItem.user_id,
        task: todoItem.task,
        is_complete: todoItem.status
      } as const

      const { error, status } = await supabase
        .from('todos')
        .upsert(result)

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      setLoading(false)
      
      const channelB = supabase.channel('messages')

      channelB.subscribe((status) => {
        // Wait for successful connection
        if (status !== 'SUBSCRIBED') {
          return null
        }

        // Send a message once the client is subscribed
        channelB.send({
          type: 'broadcast',
          event: 'sync',
          payload: { message: `${todoItem.id ? 'updated' : 'created'}` },
        })
      })
      callback()
    } catch (error) {
      alert('Error updating todo item!')
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [todo, getProfile])

  useEffect(() => {
    if (supabase) {
      const dbChangeChannel = supabase.channel('db-changes');
      dbChangeChannel.on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES, 
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
          schema: 'public',
          table: 'todos',
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            alert('新增任务完成')
          }
          if (payload.eventType === 'UPDATE') {
            alert('更新任务完成')
          }
        }
      ).subscribe()
    }
  }, [supabase])

  return (
    <>
      {loading && <Loading text={loadingMessage} /> }
      {!loading && <div className="flex flex-col gap-5 w-96">
        <div>
          <Label htmlFor="userName">用户</Label>
          <Input id="userName" type="text" value={todoItem?.userName} disabled />
        </div>
        <div>
          <Label htmlFor="task">任务</Label>
          <Input
            id="task"
            type="text"
            disabled={todoItem.id ? true : false }
            value={todoItem.task}
            onChange={(e) => setTodoItem({...todoItem, task: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="status">状态</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !todoItem.status && "text-muted-foreground"
                )}
              >
                {todoItem.status != undefined
                  ? todoStatus.find(
                      (c) => c.value === todoItem.status
                    )?.label
                  : "选择状态"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-96">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {todoStatus.map((c, index) => (
                      <CommandItem
                        value={c.value ? "true": "false"}
                        key={index}
                        onSelect={() => {
                          setTodoItem({...todoItem, status: c.value })
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            c.value === todoItem.status
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {c.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-row items-center justify-between gap-5'>
          <Button
            onClick={() => handleUpdate()}
            disabled={loading}
          >
            {todoItem.id ? '更新' : '添加'}
          </Button>
        </div>      
      </div>}
    </>
    
  )
}