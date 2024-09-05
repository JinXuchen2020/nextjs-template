'use server'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getAllTodos() {
  const supabase = createClient() 

  const { data, error, status } = await supabase
    .from('todos')
    .select(`id, user_id, task, is_complete`)
    .order('id', { ascending: true })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  return data
}

export async function addTodo() {
  const supabase = createClient()

  const { data, error, status } = await supabase
    .from('todos')
    .select(`id, user_id, task, is_complete`)
    .order('id', { ascending: true })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  return data
}

export async function getTodo(id: number) {
  const supabase = createClient()

  const { data, error, status } = await supabase
    .from('todos')
    .select(`id, user_id, task, is_complete`)
    .eq('id', id)
    .single();

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  return data
}