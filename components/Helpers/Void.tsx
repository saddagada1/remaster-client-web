import React from 'react'
import voidStyles from './Void.module.css'

interface VoidProps {
    children: React.ReactNode
}

const Void: React.FC<VoidProps> = ({children}) => {
        return (<div className={voidStyles["void-root"]}>{children}</div>);
}
export default Void;