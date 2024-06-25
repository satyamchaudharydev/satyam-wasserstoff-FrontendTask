import { cn } from "@/lib/utils"

const Preview = ({
    children
} : {
    children: React.ReactNode
}) => {
    return <div className="absolute h-full w-full pointer-events-none">
            <PreviewWidget>
                {children}
            </PreviewWidget>

            <PreviewWidget full={true}>
                {children}
            </PreviewWidget>
    </div>
}
const PreviewWidget = ({
    children, 
    full = false
} : {
    children: React.ReactNode,
    full?: boolean
}) => {
    const height = 180;
    const width = 250;
    if(full){
      return  <div 
            className={cn("border", 
            `absolute rounded-[6px] overflow-hidden w-[800px] h-[700px] 
         left-0 right-0 m-auto top-0 bottom-0 bg-background`
            )}
            
         >
            <div 
                className="h-[40px] bg-white text-center text-[#A1A1B6] flex justify-center items-center">
                <span>Preview</span>
            </div>
                
            {children}
    </div>
    }
    return <div 
            className={cn("border absolute", `right-[${width}px] bottom-[70px] rounded-[6px] overflow-hidden`)}
            
            style={{height, width}}>
            <div 
                className="h-[40px] bg-white text-center text-[#A1A1B6] flex justify-center items-center">
                <span>Preview</span>
            </div>
                
            {children}
    </div>

}

export default Preview