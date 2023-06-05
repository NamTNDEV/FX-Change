import SkeletonCard from './skeleton-card'
import StuffCard from './stuff-card'
import stuffQuery from '@/graphql/queries/stuff-query'
import { Stuff } from '@/types/model'
import { useQuery } from '@apollo/client'
import { Avatar, List, Skeleton, message } from 'antd'
import VirtualList from 'rc-virtual-list'
import React, { useEffect, useRef, useState } from 'react'

interface StuffListProps {
  stuffs?: Stuff[]
  isRecommendList?: boolean
}

const StuffList = ({ stuffs, isRecommendList }: StuffListProps) => {
  const { data, loading, fetchMore } = useQuery(stuffQuery.getAll())
  const [stuffList, setStuffLis] = useState<Stuff[] | undefined>(stuffs)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStuffLis(stuffs)
  }, [stuffs])

  useEffect(() => {
    if (data && data.stuff) {

      setStuffLis(data.stuff)
    }
  }, [data])

  const appendData = () => {
    fetchMore({
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        setStuffLis([...stuffList!, ...fetchMoreResult.stuff])
        return fetchMoreResult
      },
    })
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      appendData()
    }
  })

  if (bottomRef.current) {
    observer.observe(bottomRef.current)
  }

  return (
    <div>
      <div
        className={
          'grid w-full grid-cols-3 gap-6 max-md:gap-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-2'
        }
      >
        {stuffList &&
          stuffList.length > 0 &&
          stuffList.map((item, index) => (
            <StuffCard
              data={item}
              key={item.id}
            />
            // <SkeletonCard key={item.id}/>
          ))}
      </div>
      <div ref={bottomRef}></div>
    </div>
  )
}

export default StuffList
