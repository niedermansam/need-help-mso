import React from 'react'

function Scribe({src}:{
    src: string
}) {
  return (
    <div
      style={{
        height: "calc(100vh - 124px)",
        
      }}
      className='-mt-8'
    >
      <iframe
        src={`${src.replace('/share/', '/embed/')}?as=scrollable&skipIntro=true`}
        width="100%"
        height="100%"
        allowFullScreen
        frameBorder="0"
      ></iframe>
    </div>
  );
}

export default Scribe