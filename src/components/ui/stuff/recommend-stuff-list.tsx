import StuffCard from './stuff-card'
import { Stuff } from '@/types/model'

interface StuffListProps {
  stuffs?: Stuff[]
}

const RecommendStuffList = ({ stuffs }: StuffListProps) => {
  return (
    <div>
      <div
        className={
          'grid w-full grid-cols-1 gap-6 max-md:gap-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-2'
        }
      >
        {stuffs &&
          stuffs.length > 0 &&
          stuffs.map((item, index) => (
            <StuffCard
              data={item}
              key={item.id} 
            />
          ))}
      </div>
    </div>
  )
}

export default RecommendStuffList
