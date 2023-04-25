import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';

registerBlockType( 'cosmic/pricing-column', {
	title: __( 'Pricing Column', 'cosmic' ),
	description: __( 'A pricing entry in column format.', 'cosmic' ),
	icon: 'admin-users',
	parent: [ 'cosmic/pricing-table' ],
	supports: {
		reusable: false,
		html: false,
	},
	attributes: {
		heading: {
			type: 'string',
			source: 'html',
			selector: 'h4',
		},
		text: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		price: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		id: {
			type: 'number',
		},
		alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
			default: '',
		},
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
	},
	edit: Edit,
	save: Save,
});
