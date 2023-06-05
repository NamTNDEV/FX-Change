import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import { ColorPaletteProp, IconButton, Input } from '@mui/joy'
import { Send } from 'lucide-react'
import React from 'react'

interface CommentInputProps extends WithClassName {
  value: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  color?: ColorPaletteProp
}

const defaultPlaceholder = 'Nhập bình luận...'

function CommentInput({
  value,
  onChange,
  className,
  onSubmit,
  placeholder = defaultPlaceholder,
  color = 'neutral',
}: CommentInputProps) {
  return (
    <div className={cn('flex items-center p-4', className)}>
      <Input
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        color={color}
        className={cn('flex-1 mr-2')}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit && onSubmit()}
      />
      <IconButton
        onClick={onSubmit}
        variant="soft"
        color="neutral"
      >
        <Send />
      </IconButton>
    </div>
  )
}

export default CommentInput
