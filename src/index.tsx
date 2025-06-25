import * as React from 'react';
import '../styles/App.scss';

interface Props {
  text: string;
}

export const ExampleComponent = ({ text }: Props) => {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Bootstrap Test Component</h3>
        </div>
        <div className="card-body text-center">
          <p className="lead text-success">Example Component: {text}</p>
          
          <button className="btn btn-danger me-2">
            Danger Button
          </button>
          
          <button className="btn btn-warning">
            Warning Button
          </button>
          
          <div className="mt-3">
            <span className="badge bg-info text-dark p-2 me-2">Info Badge</span>
            <span className="badge rounded-pill bg-dark">Pill Badge</span>
          </div>
          
          <div className="alert alert-success mt-3">
            This is a success alert!
          </div>
        </div>
        <div className="card-footer text-muted">
          <small>Footer text</small>
        </div>
      </div>
    </div>
  );
};
