import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"NewHausaTop | Labaran Hausa na Yau","description":"NewHausaTop — sabbin labarai cikin Hausa daga Najeriya da duniya.","metadataBase":new URL("https://newhausatop.vercel.app"),openGraph:{title:"NewHausaTop",description:"Sabbin labarai cikin Hausa.",type:"website"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ha"><body>{children}</body></html>}