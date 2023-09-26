import React from 'react'
import EmailLink from './EmailLink';

function Page() {
  return (
    <div className="flex flex-col items-center justify-center pt-16 text-lg ">
      <h1 className="text-6xl font-bold text-rose-500">Get In Touch</h1>
      <p>Hi! My name is Sam. I'm the developer behind need help Missoula. </p>
      <p>
        If you have any questions, comments, or concerns, please don't hesitate
        to reach out!
      </p>
      <p className="pt-12 text-center">
        You can reach me at:
        
      </p>
      <EmailLink    />
    </div>
  );
}

export default Page