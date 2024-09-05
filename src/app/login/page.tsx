import { Label } from '@/components/ui/label'
import { login, signup } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      <h1>Login</h1>
      <form className='flex flex-col w-96 gap-10'>
        <div>
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className='flex flex-row items-center justify-between gap-5'>
          <Button formAction={login}>
            Log in
          </Button>
          <Button formAction={signup}>
          Sign up
          </Button>
        </div>
      </form>
    </div>
  )
}