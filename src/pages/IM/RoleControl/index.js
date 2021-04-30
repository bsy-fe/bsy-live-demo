import React from 'react'

const RoleControl = (Component, supported) => {
  return props => {
    return supported.indexOf(props.role) !== -1 ? (
      <Component {...props} />
    ) : null
  }
}

export default RoleControl
