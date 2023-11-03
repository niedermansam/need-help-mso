'use client'
import { api } from '@/utils/api';
import { getGroupedTags } from '@/utils/getGroupedTags';
import React from 'react'
import ReactSelect from 'react-select';

// create a function that takes a map of tags and a selected category, and returns two lists of options:
// a list of options for the selected category, and a list of options for the other categories



function TagOptions({category}: {category: string}) {
    const {   data: programTags } = api.tag.getProgramTagsByCategory.useQuery();


    console.log(programTags)


  return (
    <ReactSelect options={ getGroupedTags(programTags, category)} />
  )
}

export default TagOptions