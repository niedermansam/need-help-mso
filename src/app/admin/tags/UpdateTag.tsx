'use client'
import { api } from '@/utils/api'
import React from 'react'

function UpdateTag({tag}:{tag: string}) {

    const [old, setOld] = React.useState(tag)

    const [newTag, setNewTag] = React.useState(tag)
    

    const updateTag = api.tag.update.useMutation({
        onSuccess: () => {
            setOld(newTag)
        }
    })

    const handleSubmit =  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateTag.mutate({old: tag, new: newTag})
    }


  return (
    <form onSubmit={handleSubmit} className='py-2 flex flex-col max-w-xs'>
        <input className='rounded shadow px-2' type="text"  value={newTag} onChange={e => setNewTag(e.target.value)} />
        {old != newTag && <button type="submit">Update Tag</button>}
    </form>
  )
}

export default UpdateTag