import Image from "next/image";
import React from "react";

type ErrorBoundaryProps = {
	fallback?: React.ReactNode;
	children?: React.ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidUpdate(prevProps: ErrorBoundaryProps) {
		// Reset the boundary if the user has moved away from the broken component.
		if (prevProps.children !== this.props.children) {
			this.setState({ hasError: false });
		}
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		logError(error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="block max-h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] items-center justify-center space-x-4 sm:flex">
					<h1 className="text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
						Uh oh! Something went wrong. Please try refreshing the page.
					</h1>
					<div className="flex justify-center">
						<Image
							src="/construction.gif"
							alt="Robin GIF"
							width={64}
							height={128}
							quality={100}
						/>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

function logError(error: Error, componentStack: string) {
	// TODO: Implement error logging
	console.error("Error encountered:", error, componentStack);
}

export default ErrorBoundary;
