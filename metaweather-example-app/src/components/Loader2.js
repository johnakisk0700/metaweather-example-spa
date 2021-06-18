import React from "react"

const Loader = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="lds-ellipsis" style={{margin: 'auto', position: 'absolute', top: '0', left: '0', right: '0', bottom: '0'}}><div></div><div></div><div></div><div></div></div>
    )
})

export default Loader
