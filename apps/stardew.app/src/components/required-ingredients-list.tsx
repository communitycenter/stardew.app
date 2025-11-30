import React from "react";
import { InfoCard } from "./cards/info-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

interface RequiredIngredientsListProps {
	title: string;
	requiredIngredients: {
		itemID: string;
		name: string;
		quantity: number;
		sourceURL: string;
	}[];
}

export const RequiredIngredientsList: React.FC<
	RequiredIngredientsListProps
> = ({ title, requiredIngredients }) => {
	return (
		<Accordion type="single" collapsible defaultValue="item-1" asChild>
			<section className="space-y-3">
				<AccordionItem value="item-1">
					<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</AccordionTrigger>
					<AccordionContent asChild>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
							{requiredIngredients.map((ingredient) => (
								<InfoCard
									key={ingredient.itemID}
									title={ingredient.name}
									description={`x${ingredient.quantity}`}
									sourceURL={ingredient.sourceURL}
								/>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>
			</section>
		</Accordion>
	);
};

RequiredIngredientsList.displayName = "RequiredIngredientsList";
