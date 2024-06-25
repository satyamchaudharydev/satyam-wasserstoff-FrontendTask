import { cn } from "@/lib/utils"

const Button = ({children, onClick, className} : {
    children: React.ReactNode,
    className?: string,
    onClick?: () => void
}) => {
    return <button onClick={onClick} className={cn("p-2 px-5 bg-blue-500 text-white rounded", className)}>{children}</button>
}

export default Button