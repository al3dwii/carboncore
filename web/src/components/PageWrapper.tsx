import PlugInWrapper from "./PlugInWrapper";
export default function PageWrapper({id,children}:{id:string,children:any}){
  return <PlugInWrapper id={id}><div className="p-6">{children}</div></PlugInWrapper>
}
