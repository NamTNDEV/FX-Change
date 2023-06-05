import { NextPageWithLayout } from '../_app'
import CommentBox from '@/components/ui/common/comment-box'
import StuffDetail from '@/components/ui/common/stuff-detail'
import RecommandStuffs from '@/components/ui/stuff/recommend-stuffs'
import { useAuth } from '@/contexts/auth-context'
import { useSocket } from '@/contexts/socket-context'
import CommentQuery from '@/graphql/queries/comment-query'
import StuffQuery from '@/graphql/queries/stuff-query'
import { Comment, CommentInput, CommentSocketResponse } from '@/types/model'
import { useQuery } from '@apollo/client'
import { Button, Input, Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { message } from 'antd'
import _ from 'lodash'
import { Send } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import ShortUniqueId from 'short-unique-id'

const StuffDetailPage: NextPageWithLayout = () => {
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()
  const { redirectToLogin } = useAuth()
  const { data: stuffData } = useQuery(StuffQuery.getByID(), {
    variables: {
      id: router.query.stuffId,
    },
  })
  const { data: recommendStuffs } = useQuery(StuffQuery.getRecommendStuff(), {
    variables: {
      id: router.query.stuffId,
    },
  })
  const { data, loading, error } = useQuery(CommentQuery.getByStuffId(), {
    variables: {
      stuffId: router.query.stuffId,
    },
  })
  const { socket, isConnected } = useSocket()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [commentValue, setCommentValue] = useState('')
  const [comments, setComments] = React.useState<Comment[]>([])

  useEffect(() => {
    if (!loading) {
      setComments(data?.comments || [])
    }
  }, [data, loading])

  const updateComment = useCallback(
    (targetId: string, newComment: Comment) => {
      const _comments = [...comments]
      _comments.forEach((cmt) => {
        if (cmt.id === targetId) {
          cmt = { ...newComment }
        }
      })
      setComments(_.cloneDeep(_comments))
    },
    [comments]
  )

  const addComment = useCallback(
    (newComment: Comment) => {
      const _comments = [...comments]
      let existComment = _comments.find((cmt: Comment) => cmt.id === newComment.id)

      if (!existComment) {
        _comments.push(newComment)
      } else {
        existComment = { ...newComment }
      }
      setComments(_.cloneDeep(_comments))
    },
    [comments]
  )

  React.useEffect(() => {
    if (!socket) return
    socket.connect()
    const stuffId = router.query.stuffId
    socket.emit('stuff:view', { stuff_id: stuffId })

    return () => {
      socket.disconnect()
    }
  }, [socket, router.query.stuffId])

  React.useEffect(() => {
    function createdCommentHandler(payload: CommentSocketResponse) {
      console.log('🚀 ~ file: [stuffId].tsx:55 ~ socket.on ~ payload:', payload)
      addComment(payload.comment)
    }

    function updateOwnComment(payload: CommentSocketResponse) {
      updateComment(payload.temp_id, payload.comment)
    }

    if (!socket) return
    socket.on('comment:created', createdCommentHandler)
    return () => {
      socket.off('comment:created', createdCommentHandler)
    }
  }, [socket, addComment, updateComment])

  const handleSubmitComment = () => {
    if (commentValue === '') {
      return messageApi.warning('Chưa nhập bình luận.')
    }

    try {
      if (!user || !user.uid) {
        messageApi.warning('Cần đăng nhập trước khi bình luận.')
        return redirectToLogin()
      }

      const generator = new ShortUniqueId()
      const newComment: CommentInput = {
        active: true,
        author_id: user.uid,
        stuff_id: router.query.stuffId as string,
        content: commentValue,
        id: generator.randomUUID(9),
      }

      console.log({ newComment })
      addComment(newComment)
      setCommentValue('')
      if (!socket?.connected || !socket) {
        throw new Error('Lỗi kết nối. Không thể bình luận ngay lúc này. Vui lòng thử lại sau')
      }

      setIsLoading(true)

      socket.timeout(300).emit('comment:create', newComment, () => {
        setIsLoading(false)
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (!stuffData) {
    return <div></div>
  }

  return (
    <div className="container grid gap-6 grid-cols-stuff_detail">
      {contextHolder}
      <StuffDetail stuff={stuffData.stuff} />
      <Tabs
        className="flex-shrink-0 max-w-[400px] h-fit"
        aria-label="Basic tabs"
        defaultValue={0}
        sx={{ borderRadius: 'lg' }}
      >
        <TabList>
          <Tab>Gợi ý</Tab>
          <Tab>Bình luận ({comments.length})</Tab>
        </TabList>
        <TabPanel
          value={0}
          sx={{ p: 2 }}
        >
          <div className="w-full overflow-hidden bg-white border rounded-lg h-fit">
            {recommendStuffs && recommendStuffs.getRelateStuff ? (
              <RecommandStuffs stuffs={recommendStuffs.getRelateStuff} />
            ) : (
              <></>
            )}
          </div>
        </TabPanel>
        <TabPanel
          value={1}
          sx={{ p: 2 }}
        >
          <div className="w-full overflow-hidden bg-white border rounded-lg h-fit">
            <CommentBox comments={comments} />
            <div className="flex items-center p-4">
              <Input
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                disabled={!isConnected}
                color="neutral"
                className="flex-1 mr-2"
                placeholder="Nhập bình luận..."
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
              />
              <Button
                loading={isLoading}
                disabled={!isConnected}
                onClick={handleSubmitComment}
                variant="soft"
                color="neutral"
              >
                <Send />
              </Button>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default StuffDetailPage
