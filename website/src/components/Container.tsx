import {ReactNode } from 'react';
import './Container.css'; // Assuming you have a CSS file for styling

type ContainerProps = {
  children: ReactNode; // This could be any valid React node
};

// This function component wraps any passed children with a div that can have custom styles
function Container({ children }: ContainerProps): JSX.Element {
  return (
    <div className="container">
      {children}
    </div>
  );
}

export default Container;
