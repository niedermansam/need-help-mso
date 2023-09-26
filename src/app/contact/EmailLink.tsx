'use client'
import React from 'react'

function EmailLink() {
    const [buttonText, setButtonText] = React.useState("Copy");
  return (
    <div>
      <a href="&#109;&#97;il&#116;o&#58;n%65e%64%&#54;8&#101;&#108;%70&#109;i%7&#51;s%&#54;F%75%6&#67;&#97;&#64;g&#109;&#97;%&#54;9l&#46;%63o%6D">
        needhelp&#109;&#105;&#115;soula&#64;&#103;mail&#46;com
      </a>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(
            "needhelpmissoula@gmail.com"
          );
            setButtonText("Copied!");
        }}
        className="ml-2 rounded bg-stone-500 px-1 text-sm text-white"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default EmailLink