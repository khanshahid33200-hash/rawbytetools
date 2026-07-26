import { ToolItem, FAQItem } from '@/types/tools';

export const SITE_NAME = 'RawByte Tools';
export const SITE_URL = 'https://rawbytetools.com';
export const SITE_DESCRIPTION = 'Free, fast, 100% private browser-side Image and PDF toolkit. Compress, edit, convert, merge, split, watermark images and PDFs without server uploads.';

export const ALL_TOOLS: ToolItem[] = [
  // --- IMAGE TOOLS ---
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    slug: 'image-compressor',
    description: 'Compress JPG, PNG, WEBP images to specific KB/MB size while maintaining crisp visual quality.',
    category: 'image',
    iconName: 'Minimize2',
    popular: true,
    metaTitle: 'Compress Image Online - Reduce Image File Size (KB/MB)',
    metaDescription: 'Free online image compressor. Reduce JPG, PNG, WEBP file size to exact KB or MB target. Fast, 100% client-side, zero upload.',
    keywords: ['image compressor', 'compress jpg to 50kb', 'reduce image size', 'png compressor', 'webp compressor'],
    features: [
      'Target specific file size in KB or MB',
      'Adjust compression quality slider with instant live preview',
      'Batch compress up to 100 images simultaneously',
      'Download individual files or all as a ZIP archive'
    ]
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    slug: 'image-resizer',
    description: 'Resize image dimensions by pixels or percentage with aspect ratio lock.',
    category: 'image',
    iconName: 'Maximize2',
    popular: true,
    metaTitle: 'Resize Image Online - Change Image Dimensions (Pixels / %)',
    metaDescription: 'Free online image resizer. Change width and height in pixels or percentage instantly in browser.',
    keywords: ['image resizer', 'resize image online', 'change image width height', 'scale image'],
    features: [
      'Resize by exact pixels (W x H) or percentage scale',
      'Toggle aspect ratio lock for exact proportions',
      'Instant browser-side preview and high-DPI rendering'
    ]
  },
  {
    id: 'crop-tool',
    title: 'Crop Tool',
    slug: 'crop-tool',
    description: 'Crop images with popular aspect ratio presets (1:1, 16:9, 4:3, Circle, Square) or free selection.',
    category: 'image',
    iconName: 'Crop',
    popular: true,
    metaTitle: 'Crop Image Online - Free Aspect Ratio & Shape Cropper',
    metaDescription: 'Crop JPG, PNG, WEBP images online. Use aspect ratios 16:9, 1:1, 4:3, square, circle or custom bounds.',
    keywords: ['crop image', 'crop photo online', 'circular crop', '16:9 crop tool', 'square crop'],
    features: [
      'Presets for 16:9, 4:3, 1:1, Square, Circle mask',
      'Interactive crop box with zoom & rotation while cropping',
      'Instant high-res output download'
    ]
  },
  {
    id: 'rotate-flip-image',
    title: 'Rotate & Flip Image',
    slug: 'rotate-flip-image',
    description: 'Rotate images 90°, 180°, 270° or set custom angles. Flip horizontally or vertically.',
    category: 'image',
    iconName: 'RotateCw',
    metaTitle: 'Rotate & Flip Image Online - 90, 180, 270 & Custom Angles',
    metaDescription: 'Rotate image clockwise, counter-clockwise, or custom degrees. Horizontal and vertical mirror flipping.',
    keywords: ['rotate image', 'flip photo', 'mirror image online', 'turn image 90 degrees'],
    features: [
      'Quick 90°, 180°, 270° rotation buttons',
      'Custom fine-grain angle slider (-180° to 180°)',
      'Horizontal & Vertical flip toggles'
    ]
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    slug: 'image-converter',
    description: 'Convert between JPG, PNG, WEBP, and AVIF formats seamlessly in batch mode.',
    category: 'image',
    iconName: 'RefreshCw',
    popular: true,
    metaTitle: 'Convert Image Online - JPG to PNG, WEBP, AVIF & vice versa',
    metaDescription: 'Free batch image converter. Convert JPG to PNG, PNG to WEBP, WEBP to JPG, AVIF instantly.',
    keywords: ['image converter', 'jpg to png', 'png to webp', 'convert webp to jpg', 'batch image converter'],
    features: [
      'Multi-format support: JPG, PNG, WEBP, AVIF',
      'Batch convert multiple files at once',
      'Quality tuning slider before conversion'
    ]
  },
  {
    id: 'watermark-image',
    title: 'Watermark Tool',
    slug: 'watermark-image',
    description: 'Add custom text or image logo watermarks with opacity, scale, rotation, and positioning.',
    category: 'image',
    iconName: 'Stamp',
    metaTitle: 'Add Watermark to Image Online - Text & Logo Stamp',
    metaDescription: 'Protect your pictures with text or image logo watermarks. Custom position, transparency, font, and scale.',
    keywords: ['watermark image', 'add text watermark', 'watermark photo online', 'logo stamp on photo'],
    features: [
      'Supports Text and Logo Image watermarks',
      '5 position presets (Center, Corners) or custom placement',
      'Opacity, rotation, scaling, and custom fonts'
    ]
  },
  {
    id: 'image-text-editor',
    title: 'Image Text Editor',
    slug: 'image-text-editor',
    description: 'Add styled text overlays, captions, strokes, shadows, and custom typography to photos.',
    category: 'image',
    iconName: 'Type',
    recentlyAdded: true,
    metaTitle: 'Add Text to Photo Online - Styled Typography & Captions',
    metaDescription: 'Add text captions to images. Choose font, color, text stroke, drop shadow, position, and rotation.',
    keywords: ['add text to image', 'photo text editor', 'caption photo online', 'styled text overlay'],
    features: [
      'Rich font selector & typography controls',
      'Text color, stroke outline, and drop shadow effects',
      'Drag or input exact X/Y positioning'
    ]
  },

  // --- PDF TOOLS ---
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor',
    slug: 'pdf-compressor',
    description: 'Compress PDF file size to target KB or MB with preset compression levels.',
    category: 'pdf',
    iconName: 'FileArchive',
    popular: true,
    metaTitle: 'Compress PDF Online - Reduce PDF File Size (KB/MB)',
    metaDescription: 'Free online PDF compressor. Compress PDF documents to smaller KB or MB file size directly in browser.',
    keywords: ['compress pdf', 'reduce pdf size', 'compress pdf to 200kb', 'pdf size reducer'],
    features: [
      'Target KB/MB size setting',
      'Preset compression modes (Low, Medium, High)',
      '100% private - PDF processed entirely in browser'
    ]
  },
  {
    id: 'pdf-editor',
    title: 'PDF Page Editor',
    slug: 'pdf-editor',
    description: 'Delete, rotate, extract, split, and drag-and-drop reorder PDF pages interactively.',
    category: 'pdf',
    iconName: 'FileText',
    popular: true,
    metaTitle: 'Edit PDF Pages Online - Reorder, Delete, Rotate & Extract Pages',
    metaDescription: 'Interactive PDF page editor. Drag to reorder pages, rotate page orientation, delete unwanted pages.',
    keywords: ['edit pdf pages', 'reorder pdf pages', 'delete page from pdf', 'rotate pdf pages'],
    features: [
      'Visual thumbnail grid of every page',
      'Drag-and-drop page reordering',
      'Per-page rotation and deletion',
      'Instant export to new PDF'
    ]
  },
  {
    id: 'pdf-to-images',
    title: 'PDF to Images',
    slug: 'pdf-to-images',
    description: 'Convert PDF pages into high-quality JPG or PNG images with custom DPI settings.',
    category: 'pdf',
    iconName: 'FileImage',
    popular: true,
    metaTitle: 'Convert PDF to Image (JPG / PNG) Online',
    metaDescription: 'Extract every page of PDF into high-res PNG or JPG images. Single page or ZIP download.',
    keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'extract pages as photos'],
    features: [
      'Renders every PDF page to image canvas',
      'Choose output format (PNG / JPG) & render quality',
      'Download individual page images or all in a ZIP file'
    ]
  },
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    slug: 'images-to-pdf',
    description: 'Combine multiple images into a single professional PDF document with layout controls.',
    category: 'pdf',
    iconName: 'Images',
    popular: true,
    metaTitle: 'Convert Images to PDF Online - JPG/PNG to PDF',
    metaDescription: 'Combine multiple JPG, PNG, WEBP pictures into one PDF file. Custom orientation, paper size (A4, Letter), margins.',
    keywords: ['images to pdf', 'jpg to pdf', 'combine pictures into pdf', 'photo to pdf converter'],
    features: [
      'Multi-image upload & drag-to-reorder grid',
      'Page orientation: Portrait or Landscape',
      'Paper sizes: A4, Letter, or Fit Image',
      'Custom margin settings & built-in compression'
    ]
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    slug: 'merge-pdf',
    description: 'Combine multiple PDF files into one unified document with drag-and-drop ordering.',
    category: 'pdf',
    iconName: 'Combine',
    popular: true,
    metaTitle: 'Merge PDF Online - Combine Multiple PDF Files',
    metaDescription: 'Combine multiple PDF documents into a single file online. Fast, secure, zero server uploads.',
    keywords: ['merge pdf', 'combine pdf files', 'join pdf documents', 'pdf joiner'],
    features: [
      'Upload and reorder multiple PDF documents',
      'Seamless single-click merging',
      'Retains document bookmarks and layout integrity'
    ]
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    slug: 'split-pdf',
    description: 'Split PDF by page ranges, single pages, or odd/even pages into separate files.',
    category: 'pdf',
    iconName: 'Scissors',
    popular: true,
    metaTitle: 'Split PDF Online - Extract Pages & Cut PDF',
    metaDescription: 'Split PDF file online into individual pages or specific page ranges (e.g. 1-3, 5-8). Download as ZIP.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'cut pdf'],
    features: [
      'Split modes: Every page, Custom range, Odd pages, Even pages',
      'Clean output zip archive of split documents',
      'Instant browser-side extraction'
    ]
  }
];

export const GENERAL_FAQS: FAQItem[] = [
  {
    question: 'Are my files uploaded to your server?',
    answer: 'No! All image compression, resizing, conversion, cropping, and PDF processing happens directly inside your web browser using HTML5 Canvas and WebAssembly. Your files never leave your computer.'
  },
  {
    question: 'Is RawByte Tools completely free to use?',
    answer: 'Yes, 100% free with no hidden fees, subscriptions, or watermarks added to your processed output files.'
  },
  {
    question: 'What is the maximum file size limit?',
    answer: 'You can upload up to 100 files per batch, with a maximum file size of 100MB per file.'
  },
  {
    question: 'Which image and PDF formats are supported?',
    answer: 'We support JPG, JPEG, PNG, WEBP, AVIF, GIF, and standard PDF documents.'
  },
  {
    question: 'Can I process files offline or on mobile devices?',
    answer: 'Yes! Because all processing runs client-side in the browser, RawByte Tools is fully responsive and works smoothly on desktop, tablet, and mobile smartphones.'
  }
];
