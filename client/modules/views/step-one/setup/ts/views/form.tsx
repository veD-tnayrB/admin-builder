import { Input, Textarea } from '@essential/builder/components/form';
import { Button } from 'pragmate-ui/components';
import { Form as BaseForm } from 'pragmate-ui/form';
import React from 'react';
import { useSetupContext } from '../context';

export const Form = () => {
	const { store, onToggleResetModal } = useSetupContext();

	return (
		<article>
			<BaseForm className="managment-form" onSubmit={store.save}>
				<div className="agrupator">
					<Input
						label={store.texts.labels.name.value}
						info={store.texts.labels.name.info}
						placeholder={store.texts.labels.name.placeholder}
						value={store.values.name}
						name="name"
						onChange={store.onChange}
					/>
					<Input
						label={store.texts.labels.subName.value}
						info={store.texts.labels.subName.info}
						placeholder={store.texts.labels.subName.placeholder}
						value={store.values.subName}
						name="subName"
						onChange={store.onChange}
					/>
				</div>
				<div className="agrupator">
					<Input
						label={store.texts.labels.scope.value}
						info={store.texts.labels.scope.info}
						placeholder={store.texts.labels.scope.placeholder}
						value={store.values.scope}
						name="scope"
						onChange={store.onChange}
					/>
					<Input
						label={store.texts.labels.title.value}
						info={store.texts.labels.title.info}
						placeholder={store.texts.labels.title.placeholder}
						value={store.values.title}
						name="title"
						onChange={store.onChange}
					/>
				</div>

				<div className="agrupator">
					<Input
						label={store.texts.labels.author.value}
						info={store.texts.labels.author.info}
						placeholder={store.texts.labels.author.placeholder}
						value={store.values.author}
						name="author"
						onChange={store.onChange}
					/>
					<Input
						label={store.texts.labels.keywords.value}
						info={store.texts.labels.keywords.info}
						placeholder={store.texts.labels.keywords.placeholder}
						value={store.values.keywords}
						name="keywords"
						onChange={store.onChange}
					/>
				</div>
				<Textarea
					label={store.texts.labels.description.value}
					info={store.texts.labels.description.info}
					placeholder={store.texts.labels.description.placeholder}
					value={store.values.description}
					name="description"
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
