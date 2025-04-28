export interface ITheme {
	// Primary color group
	primary: string;
	onPrimary: string;
	primaryContainer: string;
	onPrimaryContainer: string;

	// Secondary color group
	secondary: string;
	onSecondary: string;
	secondaryContainer: string;
	onSecondaryContainer: string;

	// Tertiary color group
	tertiary: string;
	onTertiary: string;
	tertiaryContainer: string;
	onTertiaryContainer: string;

	// Background and surface
	background: string;
	onBackground: string;
	surface: string;
	onSurface: string;
	surfaceVariant: string;

	// Outline
	outline: string;
	outlineVariant: string;

	// Error colors
	error: string;
	onError: string;
	errorContainer: string;
	onErrorContainer: string;

	// Success colors
	success: string;
	onSuccess: string;
	successContainer: string;
	onSuccessContainer: string;

	// Warning colors
	warning: string;
	onWarning: string;
	warningContainer: string;
	onWarningContainer: string;

	// Info colors
	info: string;
	onInfo: string;
	infoContainer: string;
	onInfoContainer: string;

	// Shadows and overlays
	primaryShadow: string;
	secondaryShadow: string;
	modalBackgroundColor: string;

	// Neutral colors
	neutral: string;
	onNeutral: string;
}

export interface IThemes {
	dark: ITheme | {};
	light: ITheme | {};
}

export /*bundle*/ interface IProject {
	id: string;
	name: string;
	subName: string;
	scope: string;
	description: string;
	author: string;
	keywords: string;
	title: string;
	variables: IThemes;
	repoUrl: string;
}
