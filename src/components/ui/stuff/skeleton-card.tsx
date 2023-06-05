import Badge from '../common/badge'
import FxImage from '../common/fx-image'
import UserAvatar from '../common/user-avartar'
import { Stuff } from '@/types/model'
import { Button, IconButton } from '@mui/joy'
import { Skeleton } from 'antd'
import { MoreHorizontal } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

function SkeletonCard() {
  return (
    <div className="p-5 overflow-hidden bg-white border border-slate-100 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-start gap-3">
          <div className="bg-blue-100 rounded-full">
            <Skeleton.Avatar
              size={'large'}
              active={true}
            />
          </div>
          <div>
            <h3 className="text-base font-medium mb-1">
              <Skeleton.Input
                size="small"
                active={true}
              />
            </h3>
            <p className="text-xs text-slate-400">
              <Skeleton.Input
                size="small"
                active={true}
              />
            </p>
          </div>
        </div>

        <Skeleton.Button
          size="small"
          active={true}
        />
      </div>
      <div className="relative w-full overflow-hidden rounded-xl">
        <div className="object-cover w-[350px] h-[350px]">
          <Skeleton.Image active={true} />
        </div>
      </div>
      <div className="py-3 mt-[-10px]">
        <div className="mb-2 w-fit">
          <Skeleton.Button
            size="small"
            shape="round"
            active={true}
          />
        </div>
        <div className="text-xl font-semibold max-md:text-lg">
          <Skeleton.Input size="small" active={true} />
        </div>
        <div className="text-sm">
          <Skeleton.Input size="small" active={true} />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard
