import { StuffCategory } from '@/types/model'
import { CloseOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Option, Select } from '@mui/joy'
import { Button, Input } from 'antd'
import React, { ChangeEvent } from 'react'

type Props = {
  catagoryFilter?: number
  catagories?: StuffCategory[]
  setCatagoryFilter?: React.Dispatch<React.SetStateAction<number>>
  searchInput?: string
  setSearchInput?: React.Dispatch<React.SetStateAction<string>>
}

function StuffFilter({
  catagoryFilter,
  catagories,
  searchInput,
  setCatagoryFilter,
  setSearchInput,
}: Props) {
  const handleCategoryFilterChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null
  ) => {
    if (newValue && setCatagoryFilter) {
      setCatagoryFilter(newValue)
    }
  }

  const handleInputSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchInput) {
      setSearchInput(event.target.value)
    }
  }

  const handleClearInput = () => {
    if (setSearchInput) {
      setSearchInput('1')
    }
  }

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center w-5/12">
        <div className="w-4/12">
          <Select
            color="neutral"
            variant="outlined"
            value={catagoryFilter}
            onChange={handleCategoryFilterChange}
          >
            <Option value={1}>Danh mục</Option>
            {catagories?.map((category, index) => (
              <Option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="ml-5 w-8/12">
          <Input
            size="large"
            placeholder="Nhập vào tên sản phẩm"
            value={searchInput}
            prefix={<SearchOutlined className="opacity-50" />}
            allowClear
            onChange={handleInputSearchChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Sắp xếp</span>
        <Select
          defaultValue="desc"
          placeholder="Thứ tự"
        >
          <Option value="asc">Tăng dần</Option>
          <Option value="desc">Giảm dần</Option>
        </Select>
      </div>
    </div>
  )
}

export default StuffFilter
