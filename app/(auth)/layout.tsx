import { isAuthnticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const Authlayout = async ({children} : { children : ReactNode}) => {
  const isUserAuthenticated =  await isAuthnticated();
  if(isUserAuthenticated) redirect('/')
    
  return (
    <div className='auth-layout ' >
      {children}
    </div>
  )
}

export default Authlayout
