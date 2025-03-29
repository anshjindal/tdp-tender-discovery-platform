import { Component, ErrorInfo } from 'react';

export default class ErrorBoundary extends Component {
    override state = { hasError: false};

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    override componentDidCatch(error: ErrorBoundary, info: ErrorInfo) {
        console.error('Something went wrong:', error, info);
    }

    override render() {
        if (this.state.hasError) {
            return <p style = {{ color: 'red'}} > There was aproblem. Please try again later.</p>;
        }
        return this.props.children;
    }

}