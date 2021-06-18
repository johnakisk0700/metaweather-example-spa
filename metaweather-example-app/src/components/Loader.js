import React from "react"

const Loader = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="lds-ellipsis" style={{marginLeft: 'auto', marginRight: 'auto', position: 'absolute', top: '3rem', left: '0', right: '0'}}><div></div><div></div><div></div><div></div></div>
    )
})

export default Loader
