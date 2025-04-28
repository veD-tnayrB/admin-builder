/**
 * Interface representing a color palette for a UI theme.
 * All properties are strings (hex, rgba, or CSS shadow values).
 */
export interface IThemePalette {
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

export const REQUIRED_VARIABLES = [
	'primary',
	'onPrimary',
	'primaryContainer',
	'onPrimaryContainer',
	'secondary',
	'onSecondary',
	'secondaryContainer',
	'onSecondaryContainer',
	'tertiary',
	'onTertiary',
	'tertiaryContainer',
	'onTertiaryContainer',
	'background',
	'onBackground',
	'surface',
	'onSurface',
	'surfaceVariant',
	'outline',
	'outlineVariant',
	'error',
	'onError',
	'errorContainer',
	'onErrorContainer',
	'success',
	'onSuccess',
	'successContainer',
	'onSuccessContainer',
	'warning',
	'onWarning',
	'warningContainer',
	'onWarningContainer',
	'info',
	'onInfo',
	'infoContainer',
	'onInfoContainer',
	'primaryShadow',
	'secondaryShadow',
	'modalBackgroundColor',
	'neutral',
	'onNeutral',
];
