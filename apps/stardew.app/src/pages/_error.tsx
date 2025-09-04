import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

// @ts-expect-error Pages router
const CustomErrorComponent = (props) => {
	return <Error statusCode={props.statusCode} />;
};

// @ts-expect-error Pages router
CustomErrorComponent.getInitialProps = async (contextData) => {
	await Sentry.captureUnderscoreErrorException(contextData);
	return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
