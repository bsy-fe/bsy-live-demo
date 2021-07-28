/**
 * @author 杨欣
 * @date 2021-05-18 16:29
 */
import React from 'react'
import {ConfigProvider, Form, Input, Select, Button} from 'antd'

import './index.less'
import {Subject} from 'rxjs'
import s from './liveForm.module.less'
import {globalConst} from './consts/globalConst'

export const newParamsSubject = new Subject()

function LiveForm(props) {

  const {form} = props

  // console.log('=============form::', form)

  const {getFieldDecorator, validateFields} = form
  // const [form] = Form.useForm()

  //    enterCode: "2411c01db53f4709a9d327c33ad4a984",
  //     liveId: "live-846918736510976",
  //     tenantId: "1130997662",
  //     userId: 57986922,
  //     userInfo: {nickname: "张零一", avatar: undefined, role: 2},

  // const formRef = useRef()

  const keys = ['enterCode', 'liveId', 'tenantId', 'userId', 'nickname']

  const submit = () => {
    console.log('=============submit::', form)

    validateFields((errors, values) => {
      console.log('=============', {errors, values})
      if(!errors) {
        const {
          enterCode, liveId, tenantId, userId, nickname, role
        } = values
        const newParams = {
          enterCode,
          liveId,
          tenantId,
          userId,
          userInfo: {nickname, avatar: '', role}
        }

        newParamsSubject.next(newParams)
      }
    })
  }

  return <ConfigProvider prefixCls={globalConst.antdPrefixCls}>
    <div className={s.wrapper}>
      <Form>
        {
          keys.map(key => <Form.Item key={key}>
            {
              getFieldDecorator(key, {
                rules: [
                  {
                    required: true,
                    message: `请输入${key}`
                  }
                ]
              })(<Input placeholder={`输入${key}`}/>)
            }
           
          </Form.Item>)
        }
        <Form.Item >
          {
            getFieldDecorator('role', {
              rules: [
                {
                  required: true,
                  message: '请选择角色'
                }
              ]
            })(
              <Select placeholder='选择角色'>
                <Select.Option value={1}>
                  讲师
                </Select.Option>
                <Select.Option value={2}>
                  助教
                </Select.Option>
                <Select.Option value={3}>
                  班主任
                </Select.Option>
                <Select.Option value={4}>
                  学生
                </Select.Option>
              </Select>
            )
          }
        </Form.Item>
        <Form.Item>
          <Button block type='primary' onClick={submit}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  </ConfigProvider>
}

export default Form.create({})(LiveForm)
