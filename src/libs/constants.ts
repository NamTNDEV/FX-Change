import { categoryList } from './../components/ui/common/AddNewStuffFrom/categoryList'
import { Stuff } from '@/types/model'

export const excludeRoutes = ['dang-nhap', 'dang-ky']

const exampleData = {
  name: 'Áo phông',
  description: 'Áo phông cỡ L, màu đen',
  type: 'Trao đổi',
  category: '6467d8e463220063c879f62d',
  condition: 80,
  tags: [
    {
      id: 0,
      value: 'M',
    },
    {
      id: 2,
      value: 'Samsung',
    },
  ],
  price: 0,
  type_price: 'point',
}

const categories = [
  {
    id: 1,
    name: 'Quần áo',
    slug: 'quan-ao',
  },
  {
    id: 2,
    name: 'Đồ gia dụng',
    slug: 'do-gia-dung',
  },
  {
    id: 3,
    name: 'Đồ điện tử',
    slug: 'do-dien-tu',
  },
  {
    id: 4,
    name: 'Đồ dùng học tập',
    slug: 'do-dung-hoc-tap',
  },
]

const types = [
  {
    id: 'exchange',
    name: 'Trao đổi',
  },
  {
    id: 'market',
    name: 'Mua bán',
  },
  {
    id: 'đấu giá',
    name: 'Đấu giá',
  },
]
