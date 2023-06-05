// import StuffDetail from '../../components/ui/common/stuff-detail/index'

import { ComponentHasStuffs } from '..'
import { NextPageWithLayout } from '../_app'
import { getAppLayout } from '@/components/layouts/app-layout'
import Banner from '@/components/ui/common/Banner'
import StuffFilter from '@/components/ui/stuff/stuff-filter'
import StuffList from '@/components/ui/stuff/stuff-list'
import client from '@/graphql'
import stuffQuery, { GetCategoryList } from '@/graphql/queries/stuff-query'
import { StuffCategory } from '@/types/model'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const ExchangePage: NextPageWithLayout = ({ stuff }: ComponentHasStuffs) => {
  const [catagoryFilter, setCatagoryFilter] = useState<number>(1)
  const [stuffs, setStuffs] = useState(stuff)
  const [searchInput, setSearchInput] = useState('')
  const { data: categoriesData } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

  useEffect(() => {
    if (catagoryFilter !== 1 && searchInput) {
      let newStuffs = stuff?.filter((stuffItem) => stuffItem.category.id === catagoryFilter)
      if (newStuffs) {
        newStuffs = newStuffs.filter((stuffItem) =>
          stuffItem.name.toLowerCase().includes(searchInput)
        )
      }
      setStuffs(newStuffs)
    } else if (catagoryFilter !== 1) {
      let newStuffs = stuff?.filter((stuffItem) => stuffItem.category.id === catagoryFilter)
      setStuffs(newStuffs)
    } else if (searchInput) {
      let newStuffs = stuff?.filter((stuffItem) =>
        stuffItem.name.toLowerCase().includes(searchInput)
      )
      setStuffs(newStuffs)
    } else {
      setStuffs(stuff)
    }
  }, [catagoryFilter, searchInput])

  return (
    <>
      <Banner
        title="Trao đổi"
        detail="Nơi bạn có thể trao đổi đồ cũ với mọi người thay vì bỏ đi."
      />
      <StuffFilter
        catagoryFilter={catagoryFilter}
        setCatagoryFilter={setCatagoryFilter}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        catagories={categoriesData?.categories}
      />
      <StuffList stuffs={stuffs || []} />
    </>
  )
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: stuffQuery.getByTypeSlug(),
    variables: {
      typeSlug: 'exchange',
      revalidate: 10,
    },
  })

  return {
    props: {
      stuff: data.stuff,
    },
  }
}

ExchangePage.getLayout = getAppLayout

export default ExchangePage
