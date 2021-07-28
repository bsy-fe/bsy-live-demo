/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React, {useEffect, useState} from 'react'
// import TIM from 'tim-js-sdk'

import useRole from '@/components/IM/Hooks/useRole'

const useChatRoom = ({client}) => {

  const [role] = useRole()


  const onScrollTop = async () => {

  }




  return [onScrollTop, {role} ]
}
export default useChatRoom
