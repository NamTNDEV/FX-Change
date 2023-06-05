import BlackCustomButton from '../Button/BlackCustomButton'
import SharingButton from '../Button/SharingButton'
import ConditionChip from '../condition-chip'
import FxImage from '../fx-image'
import { Stuff } from '@/types/model'
import { Button } from '@mui/joy'
import React from 'react'

type StuffDetailProps = {
  stuff: Stuff
}

function StuffDetail({ stuff }: StuffDetailProps) {
  const exchangeHandle = () => {
    alert('Exchange Handle')
  }

  const sharingHandle = () => {
    alert('Sharing Handle')
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="relative w-full pb-6 overflow-hidden rounded-lg ">
        <div className="absolute mb-3 bg-transparent top-8 left-8 md:top-2 md:left-2">
          <ConditionChip value={stuff?.condition} />
        </div>
        <FxImage
          src="https://source.unsplash.com/random?stuff"
          alt={stuff?.name}
          className="w-full max-h-[440px] object-cover"
        />
      </div>
      <div className="text-slate-600">
        <div className="text-3xl font-medium">{stuff?.name}</div>
        <div className="mt-6">
          <div className="mb-3 text-lg font-medium text-slate-700">Mô tả</div>
          <div>{stuff?.description}</div>
          <div className="mt-6 text-slate-700">
            <div className="mb-3 text-lg font-medium">Thông tin sản phẩm</div>
            <div>
              {stuff?.tags &&
                stuff.tags.map((t) => (
                  <div key={t.id}>
                    {t.tag.name}: {t.value}
                  </div>
                ))}
            </div>
            <div>Tình trạng: Rất mới</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-9">
        <div className="w-9/12">
          <Button>Trao đổi ngay</Button>
          <Button variant="outlined">Kho của bạn</Button>
        </div>
        <div>
          <SharingButton onclick={sharingHandle} />
        </div>
      </div>
    </div>
  )
}

export default StuffDetail
