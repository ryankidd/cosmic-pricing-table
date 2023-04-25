import { useEffect, useState, useRef } from '@wordpress/element';
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n'
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { useSelect } from '@wordpress/data';
import { usePrevious } from '@wordpress/compose';
import {
	PanelBody,
	SelectControl,
	Spinner,
	TextareaControl,
	ToolbarButton,
	withNotices
} from '@wordpress/components';

function Edit( { attributes, setAttributes, noticeOperations, noticeUI } ) {
	const { heading, text, price, url, alt, id } = attributes;
	const [ blobURL, setBlobURL ] = useState();

	const prevURL = usePrevious( url );

	const headingRef = useRef();

	const onChangeHeading = ( newHeading ) => {
		setAttributes( { heading: newHeading } );
	};

	const onChangeText = ( newText ) => {
		setAttributes( { text: newText } );
	};

	const onChangePrice = ( newPrice ) => {
		setAttributes( { price: newPrice } );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	};

	useEffect( () => {
		if ( isBlobURL( url ) ) {
			setBlobURL( url );
		} else {
			revokeBlobURL( blobURL );
			setBlobURL();
		}
	}, [ url ] );

	useEffect(() => {
		if(!id && isBlobURL(url)) {
			setAttributes({
				url: undefined,
				alt: '',
			});
		}
	}, []);

	useEffect( () => {
		if ( url && ! prevURL ) {
			headingRef.current.focus();
		}
	}, [ url, prevURL ] );

	const themeImageSizes = useSelect( ( select ) => {
		return select( blockEditorStore ).getSettings().imageSizes;
	}, [] );

	const image = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	const imageControls = {
		select: {
			image: ( image ) => {
				if ( ! image || ! image.url ) {
					setAttributes( {
						url: undefined,
						id: undefined,
						alt: ''
					} );
					return;
				}
				setAttributes( {
					url: image.url,
					id: image.id,
					alt: image.alt
				} );
			},
			url: ( newURL ) => {
				setAttributes( {
					url: newURL,
					id: undefined,
					alt: '',
				} );
			}
		},
		remove: () => {
			setAttributes({
				url: undefined,
				alt: '',
				id: undefined
			})
		},
		change: {
			size: ( newURL ) => {
				setAttributes( { url: newURL } );
			},
			alt: ( newAlt ) => {
				setAttributes( { alt: newAlt } );
			},
		},
		get: {
			sizeOptions: () =>  {
				if ( ! image ) return [];
				const options = [];
				const sizes = image.media_details.sizes;
				for ( const key in sizes ) {
					const size = sizes[ key ];
					const imageSize = themeImageSizes.find( ( s ) => s.slug === key );
					if ( imageSize ) {
						options.push( {
							label: imageSize.name,
							value: size.source_url,
						} );
					}
				}
				return options;
			},
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
						title={__('Image Controls', 'cosmic')}>
				{ url && !isBlobURL(url)  && (
						<TextareaControl
							label={__('Alt text', 'cosmic')}
							value={alt}
							onChange={imageControls.change.alt}
							/>

				)}
				{ id && (
					<SelectControl
						label={__('Image Size', 'cosmic')}
						options={imageControls.get.sizeOptions()}
						value={url}
						onChange={imageControls.change.size}
						help={__('description/help text')}
					/>
				)}
				</PanelBody>
			</InspectorControls>
			{ url &&  (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__('Replace Image', 'cosmic')}
						onSelect={ imageControls.select.image }
						onUrlSelect={ imageControls.select.url }
						onError={ onUploadError }
						accept="image/*"
						allowedTypes={ [ 'image' ] }
						mediaId={id}
						mediaUrl={url}
					/>
					<ToolbarButton onClick={imageControls.remove} >
						{__('Remove Image', 'cosmic')}
					</ToolbarButton>
				</BlockControls>
			) }
			<div { ...useBlockProps() }>
				{ url && (
					<div
						className={ `wp-block-cosmic-pricing-column-img${
							isBlobURL( url ) ? ' is-loading' : ''
						}` }
					>
						<img src={ url } alt={ alt } />
						{ isBlobURL( url ) && <Spinner /> }
					</div>
				) }
				<MediaPlaceholder
					icon="admin-users"
					onSelect={ imageControls.select.image }
					onUrlSelect={ imageControls.select.url }
					onError={ onUploadError }
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					disableMediaButtons={ url }
					notices={ noticeUI }
				/>
				<RichText
					ref={ headingRef }
					placeholder={ __( 'Section Heading', 'cosmic' ) }
					tagName="h4"
					onChange={ onChangeHeading }
					value={ heading }
					allowedFormats={ [] }
				/>
				<RichText
					placeholder={ __( '{{ tier price }}', 'cosmic' ) }
					tagName="p"
					onChange={ onChangePrice }
					value={ price }
					allowedFormats={ [] }
				/>
				<RichText
					placeholder={ __( 'Section Text', 'cosmic' ) }
					tagName="p"
					onChange={ onChangeText }
					value={ text }
					allowedFormats={ [] }
				/>
			</div>
		</>
	);
}

export default withNotices( Edit );
