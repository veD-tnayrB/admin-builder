import { Textarea } from '@essential/builder/components/form';
import { Button } from 'pragmate-ui/components';
import { Form as BaseForm } from 'pragmate-ui/form';
import React from 'react';
import { useVariablesSetupContext } from '../context';

export const Form = () => {
	const { store, onToggleResetModal } = useVariablesSetupContext();

	return (
		<article>
			<BaseForm className="managment-form" onSubmit={store.save}>
				<div className="flex justify-end">
					<Button variant="primary" onClick={store.downloadTemplate}>
						<div className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="lucide lucide-download-icon lucide-download">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" x2="12" y1="15" y2="3" />
							</svg>
							{store.texts.downloadTemplate}
						</div>
					</Button>
				</div>
				<Textarea
					label={store.texts.labels.light.value}
					info={store.texts.labels.light.info}
					placeholder={store.texts.labels.light.placeholder}
					value={store.values.light}
					name="light"
					onChange={store.onChange}
				/>

				<Textarea
					label={store.texts.labels.dark.value}
					info={store.texts.labels.dark.info}
					placeholder={store.texts.labels.dark.placeholder}
					value={store.values.dark}
					name="dark"
					onChange={store.onChange}
				/>

				<div className="actions">
					<Button
						fetching={store.fetching}
						variant="secondary"
						onClick={onToggleResetModal}>
						{store.texts.actions.reset}
					</Button>
					<Button
						fetching={store.fetching}
						variant="primary"
						type="submit">
						{store.texts.actions.save}
					</Button>
				</div>
			</BaseForm>
		</article>
	);
};
