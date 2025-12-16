import "./PageHeader.css"

export const PageHeader = ({ title, description, children }) => {
    return (
            <div className="global-header">
                <div className="title">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                {children}
            </div>
    )

}