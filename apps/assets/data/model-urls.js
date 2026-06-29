const MEDIA_BASE =
    'https://media.githubusercontent.com/media/Witsel-Blue/WitselBlue/main/apps/static/models';

const isProd = process.env.NODE_ENV === 'production';

export const nacreboxUrl = isProd ? `${MEDIA_BASE}/nacrebox.glb` : '/models/nacrebox.glb';

export const hairpinUrl = '/models/hairpin.glb';
export const hairpin2Url = '/models/hairpin2.glb';
