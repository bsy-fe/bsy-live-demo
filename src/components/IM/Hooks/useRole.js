/**
 * @author 杨欣
 * @date 2021-04-13 16:11
 */
import {useEffect, useState} from 'react'
import {globalConst} from '@/consts/globalConst'

const useRole = () => {
  
  const [role, setRole] = useState(4)
  
  useEffect(() => {
    if(globalConst.client?.role !== role) {
      setRole(globalConst.client?.role)
    }
  }, [
    globalConst.client?.role
  ])

  return [role]
}

export default useRole
