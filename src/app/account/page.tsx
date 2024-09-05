import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <div className='flex flex-col items-center justify-center h-screen'>
    <AccountForm user={user} />
  </div>
}