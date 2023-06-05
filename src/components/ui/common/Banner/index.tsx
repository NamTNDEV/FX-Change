import React from 'react'

type Props = {
  title: string
  detail?: string
}

function Banner({ title, detail }: Props) {
  return (
    <div className="w-full mb-8 bg-white rounded-xl">
      <div className="flex flex-col items-center p-11">
        <div className="pb-2 text-3xl font-semibold">{title}</div>
        <div className="text-slate-700">{detail}</div>
      </div>
    </div>
  )
}

export default Banner
