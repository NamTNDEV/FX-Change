import Badge from '../common/badge'
import FxImage from '../common/fx-image'
import UserAvatar from '../common/user-avartar'
import { Stuff } from '@/types/model'
import { Button, IconButton } from '@mui/joy'
import { MoreHorizontal } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  data: Stuff
  slug?: string
}

function StuffCard({ data, slug }: Props) {
  const badgetVariant: {
    [key: string]: string
  } = {
    exchange: '1',
    market: '2',
    auction: '3',
    donate: '4',
  }

  const _slug = data.type.slug + '/' + data.id

  return (
    <div className="p-5 overflow-hidden bg-white border border-slate-100 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-start gap-3">
          <UserAvatar
            size="md"
            className="bg-blue-100 rounded-full"
            src={data?.author?.information.avatar_url}
          />
          <div>
            <h3 className="text-base font-medium">{data?.author?.information.full_name}</h3>
            <p className="text-xs text-slate-400">{moment(data.create_at).format('DD/MM/YYYY')}</p>
          </div>
        </div>
        <IconButton
          variant="plain"
          color="neutral"
          className="!text-gray-400"
        >
          <MoreHorizontal />
        </IconButton>
      </div>
      <div className="relative w-full overflow-hidden rounded-xl aspect-square">
        <Link
          href={`/${data.type.slug}/${data.id}`}
          className="transition-all hover:brightness-75"
        >
          <FxImage
            className="object-cover w-full h-full"
            src={
              data.media && data.media.length > 0
                ? data.media[0]
                : 'https://source.unsplash.com/random?stuff'
            }
            alt="stuff image"
          />
        </Link>
      </div>
      <div className="py-5">
        <Badge
          className="mb-2 w-fit"
          variant={badgetVariant[data.type.id as keyof { [key: string]: string }]}
        >
          {data.type.name}
        </Badge>
        <h3 className="text-xl font-semibold max-md:text-lg">
          <Link href={`/${data.type.slug}/${data.id}`}>{data.name}</Link>
        </h3>
        <p className="text-sm">{data.description}</p>
        {data.type.id === 'mua-ban' && (
          <p className="mt-4 text-lg font-bold text-primary-600">
            {data.price} {data.type_price === 'money' ? 'đ' : 'FP'}
          </p>
        )}
      </div>
    </div>
  )
}

export default StuffCard
