import { CreateStuffQuery } from '@/graphql/queries/stuff-query'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Input } from '@mui/joy'
import React, { useEffect, useState } from 'react'

interface Data {
  name: string
  description: string
}

function Test() {
  const [count, setCount] = useState(0)
  const [mutateFunction, { data, loading, error }] = useMutation(CreateStuffQuery, {})
  console.log('🚀 ~ file: test.tsx:33 ~ Test ~ data:', data)
  const [dataFromDB, setDataFromDB] = useState<any | null>(null)
  console.log('🚀 ~ file: test.tsx:33 ~ Test ~ loading:', loading)

  // Only use for side effect

  async function callApi() {
    const data = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    return await data.json()
  }

  function handleSubmit() {
    mutateFunction({
      variables: {
        input: {
          name: 'Điện thoại iPhone 14',
          author_id: '111230125052579288677',
          description: 'Điện thoại iPhone XR màu đen, dung lượng 128GB.',
          category_id: '6467d8e463220063c879f62d',
          condition: 10,
          type_id: '6467d8e463220063c879f631',
          custom_field: {
            price: 10000000,
          },
          media: ['nam.png'],
          tags: [
            { tag_id: '6471cd0f0299734e6009c483', value: 'Xl' },
            { tag_id: '6471cd0f0299734e6009c483', value: 'Red' },
          ],
        },
      },
    })
  }

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Input
        placeholder="Name"
        value={dataFromDB?.title}
        onChange={(e) => {
          setDataFromDB((prevData: any) => {
            console.log('🚀 ~ file: test.tsx:33 ~ setDataFromDB ~ prevData:', prevData)
            return {
              title: e.target.value,
            }
          })
        }}
      />
      <Input
        placeholder="Description"
        value={dataFromDB?.id}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}

export default Test
