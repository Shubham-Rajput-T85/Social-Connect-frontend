import React, { FC } from 'react'
import classes from "./Main.module.css"

const Main: FC<{children: React.ReactNode}> = (props) => {
  return (
    <div className={ classes.main }>
        {props.children} 
    </div>
  )
}

export default Main