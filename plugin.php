<?php
/**
 * Plugin Name:       Cosmic Pricing Table
 * Description:       A cosmic pricing table.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Ryan Kidd
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cosmic
 *
 * @package           cosmic
 */

function cosmic_pricing_table_block_init() {
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', 'cosmic_pricing_table_block_init' );
