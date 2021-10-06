import React, { Suspense } from "react"
import { CurrentUser } from "./CurrentUser"

export const Header: React.FC = () => (
  <div>
    <Suspense fallback={null}>
      <CurrentUser />
    </Suspense>
  </div>
)
