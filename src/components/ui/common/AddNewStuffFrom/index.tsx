import { GetCategoryList, GetTypeList } from '../../../../graphql/queries/stuff-query'
import MemoField from '../MemoField'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { CreateStuffQuery } from '@/graphql/queries/stuff-query'
import { StuffCategory, StuffType } from '@/types/model'
import { InboxOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Input, Option, Select, Textarea } from '@mui/joy'
import { Upload, UploadFile, UploadProps, message } from 'antd'
import { ErrorMessage, Form, Formik, FormikValues } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'

type Tag = {
  tag_id: string
  value: String
}

export interface StuffInput {
  author_id: string
  name: string
  type: string
  description: string
  category: string
  condition: number
  custom_fields: {
    price?: number
    step?: number
    initial_price?: number
    duration?: any
  }
  payment_type: string
  media?: File[]
  tags?: Tag[]
}

export type SelectChangeHandler = (newValue: string | null, name: string) => void

function AddNewStuff({ onFinished }: { onFinished?: () => void }) {
  const router = useRouter()
  const { messageApi } = useApp()
  const { user } = useAuth()
  const [fileList, setFileList] = useState<File[]>([])
  const [createStuff, { data: createdStuff, loading, error }] = useMutation(CreateStuffQuery)
  const {
    data: typesData,
    loading: typeListLoading,
    error: typeListError,
  } = useQuery<{ types: StuffType[] }>(GetTypeList)
  const {
    data: categoriesData,
    loading: categoryListLoading,
    error: categoryListError,
  } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

  useEffect(() => {
    if (typeListLoading || categoryListLoading) {
      messageApi?.loading('Đang tải')
    }
  }, [typeListLoading, categoryListLoading, messageApi])

  useEffect(() => {
    if (!loading && createdStuff) {
      messageApi && messageApi.success('Đã đăng thành công')
      return onFinished && onFinished()
    }

    if (!loading && error) {
      console.log('🚀 ~ file: index.tsx:72 ~ useEffect ~ error:', error)
      messageApi && messageApi.error(error.message)
      return
    }
  }, [loading, createdStuff, error, messageApi])

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tên sản phẩm'),
    type: Yup.string().required('Vui lòng chọn hình thức'),
    category: Yup.string().required('Vui lòng chọn phân loại'),
    condition: Yup.number()
      .min(20, 'Vui lòng chọn tình trạng')
      .required('Vui lòng chọn tình trạng'),
    tag: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().test({
          message: 'Vui lòng chọn kích thước',
          test: function (value) {
            if (!this?.options.context) return false
            if (
              this?.options?.context.category &&
              this?.options?.context.category === 'clothes' &&
              !value
            ) {
              return false
            }

            return true
          },
        }),
      })
    ),
    custom_fields: Yup.object().shape({
      payment_type: Yup.string().test({
        test: function (value) {
          const values = this.options.context
          if (['market', 'auction'].includes(values?.type) && !values?.custom_fields.payment_type) {
            return false
          }

          return true
        },
      }),
      price: Yup.string()
        .required('Vui lòng nhập giá')
        .test({
          message: 'Giá cần phải lớn hơn 10.000 đồng',
          test: function (value) {
            const values = this.options.context

            if (
              values?.custom_fields.price &&
              values?.custom_fields.price <= 10000 &&
              values.custom_fields.payment_type === 'money'
            ) {
              return false
            }

            return true
          },
        })
        .test({
          message: 'Vui lòng nhập từ 5-1000 điểm',
          test: function (value) {
            const values = this.options.context

            if (
              values?.custom_fields.price &&
              (values?.custom_fields.price < 5 || values?.custom_fields.price >= 1000) &&
              values.custom_fields.payment_type === 'point'
            ) {
              return false
            }

            return true
          },
        })
        .test({
          message: 'Vui lòng nhập giá',
          test: function (value) {
            const values = this.options.context

            if (['market', 'auction'].includes(values?.type) && !values?.custom_fields.price) {
              return false
            }

            return true
          },
        }),
    }),
  })

  const handleChange = useCallback((info: any) => {
    const acceptedFiles = info.fileList.filter((file: any) => file.status !== 'error')
    const convertedFiles = acceptedFiles.map((file: UploadFile) => file.originFileObj)
    setFileList(convertedFiles)
  }, [])

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture',
    accept: '.png,.jpg,.jpeg,.mp4',
    progress: {
      size: 'small',
      style: { top: 10 },
    },
    customRequest: (options) => {
      const { file, onProgress } = options

      const isImage = (file as File).type?.startsWith('image')
      const isVideo = (file as File).type?.startsWith('video')
      const acceptedFormats = isImage || isVideo

      if (acceptedFormats && onProgress) {
        let progress = 0
        const timer = setInterval(() => {
          progress += 10
          onProgress({ percent: progress })

          if (progress >= 100 && options.onSuccess) {
            clearInterval(timer)
            options.onSuccess('ok')
          }
        }, 100)
      } else if (acceptedFormats && options.onError) {
        options.onError(new Error('Invalid file format'))
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image')
      const isVideo = file.type.startsWith('video')
      const acceptedFormats = isImage || isVideo
      if (!acceptedFormats) {
        message.error('Sai định dạng file, hãy kiểm tra lại!')
      } else if (fileList.length >= 5) {
        message.error('Số lượng file tải lên không vượt quá giới hạn 5 files!')
      } else {
        message.success('Tải file thành công.')
      }
      return acceptedFormats && fileList.length < 5 ? file : Upload.LIST_IGNORE
    },
    onChange: handleChange,
  }

  const handleSubmit = async (values: FormikValues) => {
    console.log('🚀 ~ file: index.tsx:190 ~ handleSubmit ~ values:', values)
    const stuffInput: StuffInput = {
      name: values.name,
      author_id: user?.uid as string,
      category: values.category,
      condition: values.condition,
      custom_fields: {},
      description: values.description,
      payment_type: values.custom_fields.payment_type,
      type: values.type,
      media: fileList,
      tags: values.tag,
    }

    if (['market', 'auction'].includes(values.type)) {
      stuffInput.custom_fields.price = _.toNumber(values.custom_fields.price)
    }

    if (['auction'].includes(values.type)) {
      stuffInput.custom_fields.step = _.toNumber(values.custom_fields.step_price)
      stuffInput.custom_fields.duration = _.toNumber(values.custom_fields.duration)
    }

    console.log('🚀 ~ file: index.tsx:252 ~ handleSubmit ~ stuffInput:', stuffInput)

    try {
      createStuff({
        variables: {
          input: stuffInput,
        },
      })
      setFileList([])
    } catch (error) {
      console.log({ error })
    }
  }

  const initialValues = {
    media: [],
    name: '',
    description: '',
    type: router.query.stuff_type || '',
    category: '',
    condition: 0,
    tag: [],
    custom_fields: {
      price: 0,
      step_price: 0,
      duration: null,
      payment_type: null,
    },
  }

  const conditions = [
    {
      value: 20,
      label: 'Rất cũ',
    },
    { value: 40, label: 'Cũ' },
    { value: 60, label: 'Ổn' },
    { value: 80, label: 'Mới' },
    { value: 100, label: 'Rất mới' },
  ]

  const auctionDurations = [
    { value: 30, label: '30 phút' },
    { value: 60, label: '1 giờ' },
    { value: 120, label: '2 giờ' },
    { value: 180, label: '3 giờ' },
    { value: 360, label: '6 giờ' },
    { value: 720, label: '12 giờ' },
    { value: 1080, label: '18 giờ' },
    { value: 1440, label: '24 giờ' },
  ]

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleChange, errors }) => {
          const additionFields = {
            size: false,
            price: false,
            auction: false,
          }
          console.log({ values })
          if (values.category === 'clothes') {
            additionFields.size = true
          }

          if (['market', 'auction'].includes(values.type as string)) {
            additionFields.price = true
          }

          if (values.type === 'auction') {
            additionFields.auction = true
          }

          return (
            <Form className="font-medium ">
              {/* ----- Header Form ----- */}
              <div className="flex justify-between">
                <div className="flex items-center text-base font-semibold text-slate-900">
                  Đăng đồ cũ
                </div>
                <div></div>
              </div>
              <div className="mt-6">
                <Upload.Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Nhấn hoặc kéo file vào khu vực để tải file lên.</p>
                  <p className="ant-upload-hint">
                    Chỉ hỗ trợ các file dạng video hoặc hình ảnh, kiểm tra trước khi tải lên.
                  </p>
                </Upload.Dragger>
              </div>
              {/* ----- Details Input ----- */}
              <div className="mt-6">
                {/* --- Stuff Name --- */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label htmlFor="name">Tên món đồ</label>
                  </div>
                  <div className="mt-2">
                    <Input
                      id="name"
                      value={values.name}
                      name="name"
                      onChange={(e) => {
                        setFieldValue('name', e.target.value)
                      }}
                      placeholder="Vui lòng nhập tên món đồ"
                    />
                  </div>
                </div>
                {errors.name && <div className="mt-1 ml-2 text-sm text-red-600">{errors.name}</div>}
                {/* --- Stuff Description --- */}
                <div className="mt-6">
                  <div>
                    <label htmlFor="description">Mô tả</label>
                  </div>
                  <div className="mt-2">
                    <MemoField>
                      <Textarea
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={(e) => setFieldValue('description', e.target.value)}
                        placeholder="Một số mô tả về món đồ của bạn"
                      />
                    </MemoField>
                  </div>
                </div>
                <div className="mt-6">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  ></div>
                  <div className="mb-2">
                    <label htmlFor="category">Tình trạng</label>
                  </div>
                  <div className="relative mt-2">
                    <MemoField>
                      <Select
                        id="condition"
                        name="condition"
                        value={values.condition}
                        onChange={(e, value) => setFieldValue('condition', value)}
                      >
                        <Option
                          value="0"
                          disabled
                        >
                          Vui lòng chọn
                        </Option>
                        {conditions.map((c, index) => (
                          <Option
                            value={c.value}
                            key={index + '.' + c.value}
                          >
                            {c.label}
                          </Option>
                        ))}
                      </Select>
                    </MemoField>
                  </div>
                </div>
                {errors.condition && (
                  <div className="mt-1 ml-2 text-sm text-red-600">{errors.condition}</div>
                )}
                <div className="flex justify-between gap-3 mt-4 items-between">
                  <div className="flex flex-col flex-1">
                    <div className="">
                      <div className="mb-2">
                        <label htmlFor="stufForm">Hình thức</label>
                      </div>
                      <MemoField>
                        <Select
                          color="neutral"
                          id="type"
                          name="type"
                          value={values.type}
                          onChange={(e, value) => {
                            setFieldValue('type', value)
                            setFieldValue('custom_fields.price', 0)
                            setFieldValue('custom_fields.payment_type', 'point')
                            setFieldValue('custom_fields.step_price', 0)
                            setFieldValue('custom_fields.duration', '')
                          }}
                        >
                          <Option
                            value=""
                            disabled
                          >
                            Vui lòng chọn
                          </Option>
                          {((typesData && typesData.types) || []).map((type: any) => (
                            <Option
                              key={type.id}
                              value={type.slug}
                            >
                              {type.name}
                            </Option>
                          ))}
                        </Select>
                      </MemoField>
                    </div>
                    {errors.type && (
                      <div className="mt-1 ml-2 text-sm text-red-600">{errors.type}</div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="">
                      <div className="mb-2">
                        <label htmlFor="category">Phân loại</label>
                      </div>
                      <MemoField>
                        <Select
                          id="category"
                          name="category"
                          value={values.category}
                          onChange={(e, value) => {
                            setFieldValue('category', value)
                            if (value === 'clothes') {
                              setFieldValue('tag.0.tag_slug', 'size')
                              setFieldValue('tag.0.value', '')
                            }
                          }}
                        >
                          <Option
                            value=""
                            disabled
                          >
                            Vui lòng chọn
                          </Option>
                          {((categoriesData && categoriesData.categories) || []).map(
                            (cate: any) => (
                              <Option
                                key={cate.id}
                                value={cate.slug}
                              >
                                {cate.name}
                              </Option>
                            )
                          )}
                        </Select>
                      </MemoField>
                    </div>
                    {errors.category && (
                      <div className="mt-1 ml-2 text-sm text-red-600">{errors.category}</div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mt-3">
                    {additionFields.size && (
                      <div>
                        <div className="mt-4">
                          <label
                            className="mb-3"
                            htmlFor="tag.size"
                          >
                            Kích thước
                          </label>
                          <div className="relative">
                            <MemoField>
                              <Select
                                id="tag.0.size"
                                name="tag.0.size"
                                value={
                                  values.tag[0] ? (values.tag[0] as { value?: string }).value : ''
                                }
                                onChange={(e, value) => setFieldValue('tag.0.value', value)}
                                className="w-full p-2 text-sm font-normal border rounded-md appearance-none border-1 text-slate-900"
                              >
                                <Option value="">Vui lòng chọn</Option>
                                <Option value="xxl">XXL</Option>
                                <Option value="xl">XL</Option>
                                <Option value="l">L</Option>
                                <Option value="m">M</Option>
                                <Option value="s">S</Option>
                                <Option value="xs">XS</Option>
                                <Option value="xxs">XXS</Option>
                              </Select>
                            </MemoField>
                            <ErrorMessage
                              name="tag.0.value"
                              component="div"
                              className="mt-1 ml-2 text-sm text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {additionFields.price && (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-3 mt-4">
                          {/* ----- Price ----- */}
                          <div className="flex-1">
                            <label
                              htmlFor="custom_field_price"
                              className="block mb-3 text-base font-medium"
                            >
                              {additionFields.auction ? 'Giá khởi điểm' : 'Giá bán'}
                            </label>
                            <MemoField>
                              <Input
                                id="custom_fields.price"
                                name="custom_fields.price"
                                type="number"
                                value={values.custom_fields.price || 0}
                                onChange={(e) =>
                                  setFieldValue('custom_fields.price', e.target.value)
                                }
                                placeholder="Vui lòng nhập giá"
                              />
                            </MemoField>
                            <ErrorMessage
                              name="custom_fields.price"
                              component="div"
                              className="mt-1 ml-2 text-sm text-red-600"
                            />
                          </div>
                          {/* ----- Payment Type ----- */}
                          <div className="flex-1">
                            <label
                              htmlFor="custom_fields.payment_type"
                              className="block mb-3 text-base font-medium"
                            >
                              Phương thức thanh toán
                            </label>
                            <div className="relative">
                              <MemoField>
                                <Select
                                  id="custom_fields.payment_type"
                                  name="custom_fields.payment_type"
                                  onChange={(e, value) => {
                                    setFieldValue('custom_fields.payment_type', value)
                                  }}
                                  defaultValue="money"
                                  value={values.custom_fields.payment_type}
                                >
                                  <Option value="money">Tiền mặt</Option>
                                  <Option value="point">Điểm</Option>
                                </Select>
                              </MemoField>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {additionFields.auction && (
                      <div>
                        <div className="flex justify-between mt-4">
                          <div className="w-5/12">
                            <label
                              htmlFor="custom_fields.step_price"
                              className="mt-4 text-base font-medium"
                            >
                              Bước Giá
                            </label>
                            <MemoField>
                              <Input
                                id="custom_fields.step_price"
                                name="custom_fields.step_price"
                                value={values.custom_fields.step_price || 0}
                                onChange={(e) => {
                                  setFieldValue('custom_fields.step_price', e.target.value)
                                }}
                                type="number"
                                placeholder="Vui lòng nhập bước giá"
                              />
                            </MemoField>
                            <ErrorMessage
                              name="custom_fields.step_price"
                              component="div"
                              className="mt-1 ml-2 text-sm text-red-600"
                            />
                          </div>
                          <div className="w-5/12">
                            <div className="mb-3">
                              <label htmlFor="custom_fields.duration">Thời hạn đấu giá</label>
                            </div>
                            <div className="relative">
                              <MemoField>
                                <Select
                                  id="custom_fields.duration"
                                  name="custom_fields.duration"
                                  value={values.custom_fields.duration}
                                  onChange={(e, value) => {
                                    if (value) setFieldValue('custom_fields.duration', value)
                                  }}
                                >
                                  <Option
                                    value=""
                                    disabled
                                  >
                                    Vui lòng chọn
                                  </Option>
                                  {auctionDurations.map((ad, index) => (
                                    <Option
                                      value={ad.value}
                                      key={index + '.' + ad.value}
                                    >
                                      {ad.label}
                                    </Option>
                                  ))}
                                </Select>
                              </MemoField>
                              <ErrorMessage
                                name="custom_fields.duration"
                                component="div"
                                className="mt-1 ml-2 text-sm text-red-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* -----Submit Button ----- */}
              <div className="mt-16">
                <Button
                  fullWidth
                  color="info"
                  loading={loading}
                  type="submit"
                >
                  Đăng
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default AddNewStuff
