import StuffList from '@/components/ui/stuff/stuff-list'
import { Stuff } from '@/types/model'
import { Sheet } from '@mui/joy'
import React from 'react'
import RecommendStuffList from './recommend-stuff-list'

type Props = {
  stuffs?: Stuff[] | null
}

const RecommandStuffs = ({ stuffs }: Props) => {
  return (
    <div className="h-[560px]">
      <Sheet
        variant="outlined"
        sx={{
          maxHeight: 560,
          overflow: 'auto',
        }}
      >
        <RecommendStuffList
          stuffs={stuffs || []}
        />
      </Sheet>
    </div>
  )
}

export default RecommandStuffs
