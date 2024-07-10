import React from "react";

export function ContainerPage({ children }) {
  return (
    <div className="md:mt-12 mt-6" id="main-content">
      {children}
    </div>
  );
}

export default ContainerPage;
