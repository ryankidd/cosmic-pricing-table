import { registerBlockType } from '@wordpress/blocks';
import './pricing-column';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'cosmic/pricing-table', {
	edit: Edit,
	save,
} );
