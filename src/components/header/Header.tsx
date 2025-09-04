import React from 'react'

const Header:React.FC<{children: React.ReactNode}> = (props) => {
  return (
    <div className='header'>
        {props.children}
    </div>
  )
}

export default Header
