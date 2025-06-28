import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import RPApp from "./RPApp.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RPApp />
  </StrictMode>,
)
