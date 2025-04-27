import config from '@essential/builder/config';
import React from 'react';

export /*bundle*/ const MainHeader = () => {
	const logopath = '/assets/logo.png';
	const appName = config.params.application.name;
	return (
		<header className="main-header">
			<img src={logopath} alt="logo" />
			<h1>{appName}</h1>
		</header>
	);
};
