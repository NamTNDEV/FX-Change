import { NextPageWithLayout } from './_app'
import { getAppLayout } from '@/components/layouts/app-layout'
import AddingStuffCTA from '@/components/ui/stuff/adding-stuff-cta'
import StuffFilter from '@/components/ui/stuff/stuff-filter'
import client from '@/graphql'
import stuffQuery, { GetCategoryList } from '@/graphql/queries/stuff-query'
import { StuffListGraphQLResponse } from '@/types/common'
import { Stuff, StuffCategory } from '@/types/model'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const StuffList = dynamic(() => import('@/components/ui/stuff/stuff-list'), {
  ssr: false,
})

/**
 const MyComponent = dynamic(() => import('./components/MyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering for this component
});
 */

export interface ComponentHasStuffs {
  stuff?: Stuff[] | null
}

const Home: NextPageWithLayout = (props: ComponentHasStuffs) => {
  const [catagoryFilter, setCatagoryFilter] = useState<number>(1)
  const [stuffs, setStuffs] = useState(props.stuff)
  const [searchInput, setSearchInput] = useState('')
  const { data: categoriesData } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

  useEffect(() => {
    if (catagoryFilter !== 1 && searchInput) {
      let newStuffs = props.stuff?.filter((stuffItem) => stuffItem.category.id === catagoryFilter)
      if (newStuffs) {
        newStuffs = newStuffs.filter((stuffItem) =>
          stuffItem.name.toLowerCase().includes(searchInput)
        )
      }
      setStuffs(newStuffs)
    } else if (catagoryFilter !== 1) {
      let newStuffs = props.stuff?.filter((stuffItem) => stuffItem.category.id === catagoryFilter)
      setStuffs(newStuffs)
    } else if (searchInput) {
      let newStuffs = props.stuff?.filter((stuffItem) =>
        stuffItem.name.toLowerCase().includes(searchInput)
      )
      setStuffs(newStuffs)
    } else {
      setStuffs(props.stuff)
    }
  }, [catagoryFilter, searchInput])
  
  return (
    <>
      <div className="w-full mb-8">
        <AddingStuffCTA className="mx-auto" />
      </div>
      <StuffFilter
        catagoryFilter={catagoryFilter}
        setCatagoryFilter={setCatagoryFilter}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        catagories={categoriesData?.categories}
      />
      <StuffList
        stuffs={stuffs || []}
      />
    </>
  )
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: stuffQuery.getAll(),
  })

  return {
    props: {
      stuff: data.stuff,
    },
    revalidate: 10,
  }
}

Home.getLayout = getAppLayout

export default Home
