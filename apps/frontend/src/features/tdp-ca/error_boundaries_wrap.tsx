import ErrorBoundary from "../tdp-ca/Error_boundaries";
import CaMain from "../tdp-ca/ca-main";

function Wrap() {
    return (
        <ErrorBoundary>
        <CaMain/>
        </ErrorBoundary>
    );

}

export default Wrap;

