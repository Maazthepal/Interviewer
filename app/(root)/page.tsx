import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/public/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <section className='card-cta' >
        <div className='flex flex-col gap-6 max-w-lg' >
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className='text-lg' >
            Practice on Real Interview Question & get Instant Feedback
          </p>

          <Button asChild className='btn-primary max-sm:w-full' >
            <Link href="/interview" >Start an interview</Link>
          </Button>
        </div>


        <Image src="/robot.png" alt="Robo-dude" width={400} height={400} className='max-sm:hidden' />
      </section>
      <section className='flex flex-col gap-6 mt-8 ' >
        <h2>Yout Interviews</h2>
        <div className='interviews-section' >
          {dummyInterviews.map((interview) => 
            <InterviewCard {...interview} key={interview.id} />
          )}
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8' >
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => 
            <InterviewCard {...interview} key={interview.id}/>
          )}
          {/*<p> There are no Interviews available.</p>*/}
        </div>
      </section>
    </>
  )
}

export default page