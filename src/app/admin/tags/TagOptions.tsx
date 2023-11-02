'use client'
import { api } from '@/utils/api';
import React from 'react'

function TagOptions() {
    const {   data: programTags } = api.tag.getProgramTagsByCategory.useQuery();
    console.log(programTags)
  return (
    <div> </div>
  )
}

export default TagOptions