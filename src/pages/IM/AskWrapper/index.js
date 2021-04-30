/**
 * @author 杨欣
 * @date 2021-04-13 16:10
 */
import React from 'react'
import useRole from '@/components/IM/Hooks/useRole'
import Ask from '@/pages/IM/Ask'

const AskWrapper = (props) => {
  
    const [role] = useRole()
  
    return <Ask {...props}/>
}


export default AskWrapper
